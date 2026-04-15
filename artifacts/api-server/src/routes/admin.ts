import { Router } from "express";
import { db, users, ticketPermissions } from "@workspace/db";
import { eq, ne } from "drizzle-orm";

const router = Router();

router.get("/admin/users", async (_req, res) => {
  const allUsers = await db.select().from(users).where(ne(users.role, "admin"));
  const perms = await db.select().from(ticketPermissions);
  const permMap: Record<string, boolean> = {};
  perms.forEach((p) => { permMap[p.email] = p.allowed; });

  const result = allUsers.map((u) => ({
    email: u.email,
    name: u.name,
    role: u.role,
    hasAccess: !!permMap[u.email],
  }));
  return res.json(result);
});

router.post("/admin/users/:email/permission", async (req, res) => {
  const email = req.params.email.toLowerCase();
  const { allowed } = req.body as { allowed: boolean };

  await db
    .insert(ticketPermissions)
    .values({ email, allowed })
    .onConflictDoUpdate({ target: ticketPermissions.email, set: { allowed } });

  return res.json({ ok: true });
});

router.delete("/admin/users/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();
  await db.delete(ticketPermissions).where(eq(ticketPermissions.email, email));
  await db.delete(users).where(eq(users.email, email));
  return res.json({ ok: true });
});

router.put("/admin/users/:email/password", async (req, res) => {
  const email = req.params.email.toLowerCase();
  const { password } = req.body as { password: string };
  if (!password) return res.status(400).json({ error: "Contraseña requerida" });

  await db.update(users).set({ password }).where(eq(users.email, email));
  return res.json({ ok: true });
});

router.post("/admin/permissions/approve-all", async (req, res) => {
  const allUsers = await db.select().from(users).where(ne(users.role, "admin"));
  for (const u of allUsers) {
    await db
      .insert(ticketPermissions)
      .values({ email: u.email, allowed: true })
      .onConflictDoUpdate({ target: ticketPermissions.email, set: { allowed: true } });
  }
  return res.json({ ok: true });
});

router.post("/admin/permissions/revoke-all", async (req, res) => {
  const allUsers = await db.select().from(users).where(ne(users.role, "admin"));
  for (const u of allUsers) {
    await db
      .insert(ticketPermissions)
      .values({ email: u.email, allowed: false })
      .onConflictDoUpdate({ target: ticketPermissions.email, set: { allowed: false } });
  }
  return res.json({ ok: true });
});

router.get("/admin/permissions/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();
  const found = await db.select().from(ticketPermissions).where(eq(ticketPermissions.email, email));
  return res.json({ allowed: found.length > 0 ? found[0].allowed : false });
});

export default router;

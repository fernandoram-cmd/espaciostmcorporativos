import { Router } from "express";
import { db, users, ticketPermissions } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const ADMIN_EMAIL = "ramirez.ferni1545@gmail.com";
const ADMIN_PASSWORD = "Liapig1573";

export async function seedAdmin() {
  const existing = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL.toLowerCase()));
  if (existing.length === 0) {
    await db.insert(users).values({
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
      name: "Administrador",
      role: "admin",
    });
  }
}

router.post("/auth/check-email", async (req, res) => {
  const { email } = req.body as { email: string };
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const found = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
  return res.json({ exists: found.length > 0 });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: "Datos incompletos" });

  const found = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
  if (found.length === 0 || found[0].password !== password) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const u = found[0];
  return res.json({ user: { email: u.email, name: u.name, role: u.role } });
});

router.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body as { email: string; password: string; name: string };
  if (!email || !password || !name) return res.status(400).json({ error: "Datos incompletos" });

  const emailLower = email.toLowerCase().trim();
  const existing = await db.select().from(users).where(eq(users.email, emailLower));
  if (existing.length > 0) return res.status(409).json({ error: "El correo ya está registrado" });

  await db.insert(users).values({ email: emailLower, password, name, role: "Account Manager" });
  return res.json({ user: { email: emailLower, name, role: "Account Manager" } });
});

export default router;

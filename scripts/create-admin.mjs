import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const terminal = createInterface({ input, output });

try {
  const username = (await terminal.question("Usuario del administrador: ")).trim();
  const password = await terminal.question("Contraseña segura: ", { hideEchoBack: true });
  const role = (await terminal.question("Rol (owner o staff; owner por defecto): ")).trim() || "owner";

  if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(username)) {
    throw new Error("El usuario debe tener entre 3 y 50 caracteres: letras, números, punto, guion o guion bajo.");
  }
  if (password.length < 12) throw new Error("Usa una contraseña de al menos 12 caracteres.");
  if (role !== "owner" && role !== "staff") throw new Error("El rol debe ser owner o staff.");

  const hash = await bcrypt.hash(password, 12);
  console.log(`\nCopia este SQL en Supabase SQL Editor:\n\ninsert into public.admin_users (username, password_hash, role)\nvalues ('${username.replaceAll("'", "''")}', '${hash}', '${role}');\n`);
} finally {
  terminal.close();
}

"use server";

import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/lib/admin-auth";

export type LoginState = { error?: string } | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Введіть пароль" };
  }

  const ok = await signIn(password);

  if (!ok) {
    // невелика затримка проти перебору пароля
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Невірний пароль" };
  }

  revalidatePath("/admin");
  return undefined;
}

export async function logout(): Promise<void> {
  await signOut();
  revalidatePath("/admin");
}

"use server";

import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/lib/admin-auth";
import { zodFirstError } from "@/lib/validation/errors";
import { adminPasswordSchema } from "@/lib/validation/schemas";

export type LoginState = { error?: string } | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = adminPasswordSchema.safeParse(formData.get("password"));

  if (!parsed.success) {
    return { error: zodFirstError(parsed.error) };
  }

  const ok = await signIn(parsed.data);

  if (!ok) {
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

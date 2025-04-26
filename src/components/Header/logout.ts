"use server";
// import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

export async function logout() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("authToken");
    return true;
  } catch {
    return false;
  }
}

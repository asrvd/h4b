import Link from "next/link";

import { db } from "@/lib/db";
import { LegacyScrypt } from "lucia";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/components/form";
import type { ActionResult } from "@/components/form";
import { LoginForm } from "@/components/login-form";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <main className="p-4 w-full h-full flex flex-col justify-center items-center gap-4">
      <div className="lg:w-1/2 w-full p-4">
        <h1>Sign in</h1>
        <LoginForm />
        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

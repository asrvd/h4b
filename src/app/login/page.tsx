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
    <main className="p-4 w-full min-h-screen flex flex-col justify-center items-center gap-4">
      <div className="lg:w-[40%] w-full p-4">
        <h2 className="text-3xl font-bold text-center text-foreground">
          Sign in
        </h2>
        <LoginForm />
        <p className="text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/components/form";
import { LegacyScrypt } from "lucia";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpForm } from "@/components/signup-form";

import type { ActionResult } from "@/components/form";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <main className="p-4 w-full h-full flex flex-col justify-center items-center gap-4">
      <div className="lg:w-1/2 w-full p-4">
        <h1 className="font-bold text-xl mb-2">Sign up</h1>
        <SignUpForm />
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
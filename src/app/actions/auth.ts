"use server";
import { redirect } from "next/navigation";
import { LegacyScrypt } from "lucia";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { cache } from "react";
import { SignupFormValues } from "@/components/signup-form";
import { LoginFormValues } from "@/components/login-form";

export async function signup(values: SignupFormValues) {
  "use server";
  const username = values.username;
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = values.password;
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const passwordHash = await new LegacyScrypt().hash(password);

  try {
    const user = await db.user.create({
      data: {
        password_hash: passwordHash,
        email: values.email,
        phone: values.phone,
        firstName: values.firstName,
        lastName: values.lastName,
        address: {
          create: {
            street: values.address.street,
            city: values.address.city,
            state: values.address.state,
            zip: values.address.zip,
          },
        },
        latitude: values.latitude,
        longitude: values.longitude,
        username,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    return {
      error: "An unknown error occurred",
    };
  }
  return redirect("/feed");
}

export async function login(values: LoginFormValues) {
  "use server";
  const username = values.username;
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = values.password;
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await new LegacyScrypt().verify(
    existingUser.password_hash,
    password
  );
  if (!validPassword) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
    // If usernames are public, you can outright tell the user that the username is invalid.
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  console.log("logged in omg omg");
  return redirect("/feed");
}

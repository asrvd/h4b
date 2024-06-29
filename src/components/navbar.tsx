"use client";

import Link from "next/link";
import { login, logout } from "@/app/actions/auth";
import type { User, Session } from "lucia";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "./ui/button";

const navbarLinks = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/feed",
    text: "Feed",
  },
  {
    href: "/dashboard",
    text: "Dashboard",
  },
];

export default function Navbar({
  session,
  user,
}: {
  session: Session | null;
  user: User | null;
}) {
  return (
    <nav className="flex items-center justify-between p-2 border border-border sticky top-0 backdrop-blur-md bg-background/40">
      <Link
        className="text-xl font-bold cursor-pointer text-foreground"
        href={user ? "/dashboard" : "/"}
      >
        app name
      </Link>
      {/* <div className="flex items-center gap-4">
        {navbarLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <a>{link.text}</a>
          </Link>
        ))}
      </div> */}
      <div className="flex items-center gap-4">
        {user ? (
          <ProfileDropdown user={user} />
        ) : (
          <Link
            href="/login"
            className="bg-primary text-primary-foreground py-2 px-3 rounded-lg transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

const ProfileDropdown = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img
          // use alphabet avatar api
          src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${user.firstName}`}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full border border-border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {navbarLinks.map((link) => (
          <DropdownMenuItem key={link.href}>
            <Link href={link.href}>{link.text}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Feed from "@/components/feed";
import { db } from "@/lib/db";

export const dynamic = true;

async function getFeedContent() {
  const governmentReports = await db.governmentReport.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const civicReports = await db.civicReport.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    civicReports,
    governmentReports,
  };
}

export default async function Page() {
  const { user } = await validateRequest();

  const { civicReports, governmentReports } = await getFeedContent();

  if (!user) {
    return redirect("/signup");
  }

  return (
    <main className="p-4 w-full h-full flex flex-col justify-center items-center gap-4">
      <Feed 
        civicReports={civicReports}
        governmentReports={governmentReports}
        userId={user.id}
      />
    </main>
  );
}

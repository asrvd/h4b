import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardFeed from "@/components/dashboard-feed";

async function getAllReports(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      GovernmentReports: true,
      civicReports: true,
    },
  });

  return user;
}

export default async function DashboardPage() {
  const { user, session } = await validateRequest();

  if (!session) {
    return redirect("/login");
  }

  const reports = await getAllReports(user.id);

  return (
    <main className="p-4 w-full min-h-screen flex flex-col justify-center items-center gap-4">
      {!reports ? (
        <p>No reports created yet</p>
      ) : (
        <DashboardFeed
          civicReports={reports.civicReports}
          governmentReports={reports.GovernmentReports}
          userId={user.id}
        />
      )}
    </main>
  );
}

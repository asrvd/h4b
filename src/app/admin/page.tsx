import { CivicReportTag } from "@prisma/client";
import { db } from "@/lib/db";
import { AdminFeed } from "@/components/admin-feed";

async function getAllReports() {
  const civilReports = await db.civicReport.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const governmentReports = await db.governmentReport.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    civilReports,
    governmentReports,
  
  }
}

export default async function Page() {
  const allReports = await getAllReports();

  return (
    <main className="p-4 w-full h-full flex flex-col justify-center items-center gap-4">
      <AdminFeed 
        civilReports={allReports.civilReports}
        governmentReports={allReports.governmentReports}
      />
    </main>
  );
}

"use client";

import { useState } from "react";
import type { GovernmentReport } from "@prisma/client";
import type { CivicReport } from "@prisma/client";
import { Button } from "./ui/button";
import { DeleteIcon } from "lucide-react";
import { deleteReport } from "@/app/actions/main";
import Tag from "./ui/tag";

export default function DashboardFeed({
  governmentReports,
  civicReports,
}: {
  governmentReports: GovernmentReport[];
  civicReports: CivicReport[];
  userId: string;
}) {
  const [tab, setTab] = useState<"civic" | "government">("civic");

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-start items-center">
      <div className="flex flex-col justify-start w-full lg:w-1/2 min-h-full text-center gap-4">
        <h1 className="text-3xl font-bold text-left">Dashboard Feed</h1>

        <div className="flex gap-2 items-center w-full justify-center">
          <Button
            className={`${
              tab === "civic"
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : "bg-white text-zinc-900"
            } px-4 py-2 rounded w-full `}
            variant={"outline"}
            onClick={() => setTab("civic")}
          >
            Civic Reports
          </Button>
          <Button
            className={`${
              tab === "government"
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : "bg-white text-zinc-900"
            } px-4 py-2 rounded w-full `}
            variant={"outline"}
            onClick={() => setTab("government")}
          >
            Government Reports
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {tab === "civic"
            ? civicReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 w-full shadow-sm border border-gray-200 rounded-lg flex flex-col gap-2 justify-start"
                >
                  <h2 className="text-lg font-semibold text-left text-foreground">
                    {report.title}
                  </h2>
                  <p className="text-left text-sm text-muted-foreground">
                    {report.message}
                  </p>
                  <div className="flex justify-between w-full text-xs">
                    <p>
                      <span className="font-semibold" suppressHydrationWarning>
                        Date:
                      </span>{" "}
                      {Intl.DateTimeFormat("en-US", {
                        dateStyle: "full",
                        timeStyle: "short",
                      }).format(new Date(report.createdAt))}
                    </p>

                    <Button
                      variant="outline"
                      className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                      onClick={() => deleteReport(report.id, tab)}
                    >
                      <DeleteIcon size={12} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Tag text={report.tag} />
                    <Tag text={report.status} />
                  </div>
                </div>
              ))
            : governmentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 w-full shadow-sm border border-gray-200 rounded-lg flex flex-col gap-2 justify-start"
                >
                  <h2 className="text-lg font-semibold text-left text-foreground">
                    {report.title}
                  </h2>
                  <p className="text-left text-sm text-muted-foreground">
                    {report.message}
                  </p>
                  <div className="flex justify-between w-full text-xs">
                    <p>
                      <span className="font-semibold" suppressHydrationWarning>
                        Date:
                      </span>{" "}
                      {Intl.DateTimeFormat("en-US", {
                        dateStyle: "full",
                        timeStyle: "short",
                      }).format(new Date(report.createdAt))}
                    </p>

                    <Button
                      variant="outline"
                      className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                      onClick={() => deleteReport(report.id, tab)}
                    >
                      <DeleteIcon size={12} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Tag text={report.status} />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

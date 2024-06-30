"use client";

import { useState } from "react";
import { CivicReportTag } from "@prisma/client";
import { ReportStatus } from "@prisma/client";

import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CivicReportWithUser, GovernmentReportWithUser } from "./feed";
import { toast } from "sonner";

import { switchStatus } from "@/app/actions/main";

// same tab type feed but every card will have a new part in lower side (form part) with a select input
// for selecting the  status, every time you select action runs

export function AdminFeed({
  civilReports,
  governmentReports,
}: {
  civilReports: CivicReportWithUser[];
  governmentReports: GovernmentReportWithUser[];
}) {
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState<"civic" | "government">("civic");
  const handleStatusChange = async (reportId: string, status: ReportStatus) => {
    console.log(reportId, status);
    setPending(true);
    try {
      await switchStatus(reportId, status, tab);
      toast("Status changed successfully");
    } catch (e) {
      toast("Failed to change status");
    }
    setPending(false);
  };

  console.log(civilReports, governmentReports);

  return (
    <div className="flex flex-col justify-start w-full lg:w-1/2 min-h-full text-center gap-4">
      <h1 className="text-3xl font-bold text-left">Report Feed</h1>

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
          ? civilReports.map((report) => (
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
                <p className="text-left text-sm text-muted-foreground">
                  {report.user.firstName}
                </p>
                <p
                  className="text-left text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  {Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(new Date(report.createdAt))}
                </p>
                <Select
                  onValueChange={(e) =>
                    handleStatusChange(report.id, e as ReportStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        report.status === "PENDING"
                          ? "Pending"
                          : report.status === "RESOLVED"
                          ? "Resolved"
                          : "Rejected"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
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
                <p className="text-left text-sm text-muted-foreground">
                  {report.anonymous ? "Anonymous" : report.user.firstName}
                </p>
                <p
                  className="text-left text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  {Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(new Date(report.createdAt))}
                </p>
                <Select
                  onValueChange={(e) =>
                    handleStatusChange(report.id, e as ReportStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        report.status === "PENDING"
                          ? "Pending"
                          : report.status === "RESOLVED"
                          ? "Resolved"
                          : "Rejected"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
      </div>
    </div>
  );
}

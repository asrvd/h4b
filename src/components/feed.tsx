"use client";

import { Prisma } from "@prisma/client";
import { useState, useEffect } from "react";
import Create from "./create";
import { Button } from "./ui/button";
import { CreateGovernmentReportForm } from "./gov-report";
import { CreateCivicReportForm } from "./civic-report";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import useGeoLocation from "@/hooks/useGeoLocation";
import { isWithin2Km } from "@/lib/geo";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ToggleSwitch } from "./toggle-switch";
import { upVoteGovernmentReport } from "@/app/actions/main";
import { voteCivicReport } from "@/app/actions/main";
import { ArrowUpIcon, ArrowDownIcon, MoveDiagonalIcon } from "lucide-react";
import ReportEnalrgedDialog from "./report-dialog";
import Tag from "./ui/tag";

export type GovernmentReportWithUser = Prisma.GovernmentReportGetPayload<{
  include: { user: true };
}>;

export type CivicReportWithUser = Prisma.CivicReportGetPayload<{
  include: { user: true };
}>;

export default function Feed({
  civicReports,
  governmentReports,
  userId,
}: {
  civicReports: CivicReportWithUser[];
  governmentReports: GovernmentReportWithUser[];
  userId: string;
}) {
  const { latitude, longitude, error, requestLocation } = useGeoLocation();
  const [enlargedReport, setEnlargedReport] = useState<
    CivicReportWithUser | null | GovernmentReportWithUser
  >(null);
  const [filterNearbyReports, setFilterNearbyReports] =
    useState<boolean>(false);
  const [filteredCivicReports, setFilteredCivicReports] = useState<
    CivicReportWithUser[]
  >([]);
  console.log("chekck:", filterNearbyReports);

  useEffect(() => {
    if (latitude && longitude && filterNearbyReports) {
      console.log("running");
      setFilteredCivicReports(
        civicReports.filter((report) =>
          isWithin2Km(
            { latitude: report.latitude, longitude: report.longitude },
            { latitude, longitude }
          )
        )
      );
      toast.success(`Filtered youre feed based on your current location.`);
    }
  }, [latitude, longitude, filterNearbyReports]);

  useEffect(() => {
    if (!latitude && !longitude && !error) {
      requestLocation();
    }
  }, [latitude, longitude, requestLocation, error]);
  console.log(latitude, longitude, error);
  const [tab, setTab] = useState<"civic" | "government">("civic");
  const [showGovernmentReportForm, setShowGovernmentReportForm] =
    useState(false);
  const [showCivicReportForm, setShowCivicReportForm] = useState(false);

  const handleCivicReportVote = async (
    vote: boolean,
    userId: string,
    reportId: string
  ) => {
    const res = await voteCivicReport(vote, userId, reportId);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Vote submitted successfully.");
  };

  const handleGovernmentReportVote = async (
    userId: string,
    reportId: string
  ) => {
    const res = await upVoteGovernmentReport(userId, reportId);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Vote submitted successfully.");
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen">
      <CreateGovernmentReportForm
        showDialog={showGovernmentReportForm}
        setShowDialog={setShowGovernmentReportForm}
        userId={userId}
      />
      <CreateCivicReportForm
        showDialog={showCivicReportForm}
        setShowDialog={setShowCivicReportForm}
        userId={userId}
      />
      <div className="flex flex-col justify-start w-full lg:w-2/3 min-h-full text-center gap-4">
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
        {tab === "civic" && (
          <div className="flex gap-2 w-full justify-start">
            <ToggleSwitch
              label="Filter nearby reports"
              enabled={filterNearbyReports}
              setEnabled={setFilterNearbyReports}
            />
          </div>
        )}
        {tab === "civic" && (
          <div className="grid grid-cols-1 gap-4">
            {!filterNearbyReports
              ? civicReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 w-full shadow-sm border border-gray-200 rounded-lg flex flex-col gap-2 justify-start"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <h2 className="text-xl font-bold text-left">
                        {report.title}
                      </h2>
                      <div className="flex flex-col text-xs">
                        <p className="text-gray-500">Lat: {report.latitude}</p>
                        <p className="text-gray-500">Lng: {report.longitude}</p>
                      </div>
                    </div>
                    <p
                      className="text-sm text-gray-500 text-left"
                      suppressHydrationWarning
                    >
                      reported by{" "}
                      <span className="font-semibold">
                        {report.user.firstName}
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold" suppressHydrationWarning>
                        {Intl.DateTimeFormat().format(
                          new Date(report.createdAt)
                        )}
                      </span>
                    </p>
                    <div className="flex w-full justify-between gap-4">
                      <div className="flex flex-row gap-2 items-center">
                        <Button
                          variant="outline"
                          className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                          onClick={() =>
                            handleCivicReportVote(true, userId, report.id)
                          }
                        >
                          {report.upvotes}
                          <ArrowUpIcon size={12} />
                        </Button>
                        <Button
                          variant="outline"
                          className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                          onClick={() =>
                            handleCivicReportVote(false, userId, report.id)
                          }
                        >
                          {report.downvotes}
                          <ArrowDownIcon size={12} />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                        onClick={() => setEnlargedReport(report)}
                      >
                        <MoveDiagonalIcon size={12} />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Tag text={report.tag} />
                      <Tag text={report.status} />
                    </div>
                    {/* <p className="text-gray-800">{report.message}</p> */}
                  </div>
                ))
              : filteredCivicReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 w-full shadow-sm border border-gray-200 rounded-lg flex flex-col gap-2 justify-start"
                  >
                    <h2 className="text-xl font-bold text-left">
                      {report.title}
                    </h2>
                    <p
                      className="text-sm text-gray-500 text-left"
                      suppressHydrationWarning
                    >
                      reported by{" "}
                      <span className="font-semibold">
                        {report.user.firstName}
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold" suppressHydrationWarning>
                        {Intl.DateTimeFormat().format(
                          new Date(report.createdAt)
                        )}
                      </span>
                    </p>
                    <div className="flex w-full justify-between gap-4">
                      <div className="flex flex-row gap-2 items-center">
                        <Button
                          variant="outline"
                          className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                          onClick={() =>
                            handleCivicReportVote(true, userId, report.id)
                          }
                        >
                          {report.upvotes}
                          <ArrowUpIcon size={12} />
                        </Button>
                        <Button
                          variant="outline"
                          className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                          onClick={() =>
                            handleCivicReportVote(false, userId, report.id)
                          }
                        >
                          {report.downvotes}
                          <ArrowDownIcon size={12} />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                        onClick={() => setEnlargedReport(report)}
                      >
                        <MoveDiagonalIcon size={12} />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Tag text={report.tag} />
                      <Tag text={report.status} />
                    </div>
                    {/* <p className="text-gray-800">{report.message}</p> */}
                  </div>
                ))}
          </div>
        )}

        {tab === "government" && (
          <div className="grid grid-cols-1 gap-4">
            {governmentReports.map((report) => (
              <div
                key={report.id}
                className="p-4 w-full border border-gray-200 rounded-lg flex flex-col gap-2"
              >
                <h2 className="text-xl font-bold text-left">{report.title}</h2>
                <p
                  className="text-sm text-gray-500 text-left"
                  suppressHydrationWarning
                >
                  {report.anonymous ? (
                    "Anonymous report "
                  ) : (
                    <>
                      reported by{" "}
                      <span className="font-semibold">
                        {report.user.firstName}
                      </span>{" "}
                    </>
                  )}
                  on{" "}
                  <span className="font-semibold" suppressHydrationWarning>
                    {Intl.DateTimeFormat().format(new Date(report.createdAt))}
                  </span>
                </p>
                <div className="flex w-full justify-between gap-4">
                  <div className="flex flex-row gap-2 items-center">
                    <Button
                      variant="outline"
                      className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                      onClick={() =>
                        handleGovernmentReportVote(userId, report.id)
                      }
                    >
                      {report.upvotes}
                      <ArrowUpIcon size={12} />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="px-2 rounded-full text-xs py-3 flex items-center justify-center gap-1 !h-0 leading-none"
                    onClick={() => setEnlargedReport(report)}
                  >
                    <MoveDiagonalIcon size={12} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Tag text={report.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {enlargedReport && (
          <ReportEnalrgedDialog
            report={enlargedReport}
            onClose={() => setEnlargedReport(null)}
            reportType={tab}
          />
        )}

        <Create
          setShowCivicReportDialog={setShowCivicReportForm}
          setShowGovernmentReportDialog={setShowGovernmentReportForm}
        />
      </div>
    </div>
  );
}

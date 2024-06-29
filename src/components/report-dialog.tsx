import { DialogComponent } from "./ui/dialog";
import type { CivicReportWithUser, GovernmentReportWithUser } from "./feed";

export default function ReportEnalrgedDialog({
  report,
  onClose,
  reportType,
}: {
  report: CivicReportWithUser | GovernmentReportWithUser;
  reportType: "civic" | "government";
  onClose: () => void;
}) {
  if (reportType === "civic") {
    return (
      <DialogComponent
        dialogTitle={report.title}
        isOpen={true}
        setIsOpen={onClose}
      >
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Reported by {report.userId}
              </p>
              <p className="text-sm text-gray-500" suppressHydrationWarning>
                Reported on{" "}
                {typeof report.createdAt === "string"
                  ? report.createdAt
                  : report.createdAt.toDateString()}
              </p>
            </div>
          </div>
          <p>{report.message}</p>
        </div>
      </DialogComponent>
    );
  }
}

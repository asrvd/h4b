"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { CivicReport, GovernmentReportCategory } from "@prisma/client";
import type { GovernmentReportFormValues } from "@/components/gov-report";
import type { CivicReportFormValues } from "@/components/civic-report";
import { revalidatePath } from "next/cache";
import { ReportStatus } from "@prisma/client";

export async function createCivicReport(
  values: CivicReportFormValues,
  userId: string
) {
  if (!userId) {
    return {
      error: "Invalid user ID",
    };
  }

  try {
    const report = await db.civicReport.create({
      data: {
        userId: userId,
        message: values.message,
        latitude: values.latitude,
        longitude: values.longitude,
        title: values.title,
        tag: values.tag,
      },
    });
    revalidatePath("/feed");
    return report;
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function switchStatus(
  reportId: string,
  status: ReportStatus,
  type: "civic" | "government"
) {
  if (!reportId) {
    return {
      error: "Invalid report ID",
    };
  }

  try {
    if (type === "civic") {
      console.log("okay")
      const report = await db.civicReport.update({
        where: {
          id: reportId,
        },
        data: {
          status,
        },
      });

      revalidatePath("/admin");
      return report;
    } else {
      const report = await db.governmentReport.update({
        where: {
          id: reportId,
        },
        data: {
          status,
        },
      });

      revalidatePath("/admin");
      return report;
    }
  } catch (error) {
    console.log(error);
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function createGovernmentReport(
  values: GovernmentReportFormValues,
  userId: string
) {
  if (!userId) {
    return {
      error: "Invalid user ID",
    };
  }

  try {
    const report = await db.governmentReport.create({
      data: {
        userId: userId,
        message: values.message,
        officeLocation: values.officeLocation,
        officeName: values.officeName,
        officialName: values.officialName,
        category: values.category,
        title: values.title,
      },
    });
    revalidatePath("/feed");
    return report;
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function getReportsAndAlerts(userId: string) {
  if (!userId) {
    return {
      error: "Invalid user ID",
    };
  }

  try {
    const userWithReportsAndAlerts = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        civicReports: true,
        GovernmentReports: true,
      },
    });

    return userWithReportsAndAlerts;
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function getAlert(alertId: string) {
  if (!alertId) {
    return {
      error: "Invalid alert ID",
    };
  }

  try {
    const alert = await db.civicReport.findUnique({
      where: {
        id: alertId,
      },
      include: {
        user: true,
      },
    });

    return alert;
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function getReport(reportId: string) {
  if (!reportId) {
    return {
      error: "Invalid report ID",
    };
  }

  try {
    const report = await db.governmentReport.findUnique({
      where: {
        id: reportId,
      },
      include: {
        user: true,
      },
    });

    return report;
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function deleteReport(
  reportId: string,
  reportType: "civic" | "government"
) {
  if (!reportId) {
    return {
      error: "Invalid report ID",
    };
  }

  try {
    if (reportType === "civic") {
      const report = await db.civicReport.delete({
        where: {
          id: reportId,
        },
      });

      return revalidatePath("/dashboard");
    } else {
      const report = await db.governmentReport.delete({
        where: {
          id: reportId,
        },
      });

      return revalidatePath("/dashboard");
    }
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function markAlertAsSpam(alertId: string) {
  if (!alertId) {
    return {
      error: "Invalid alert ID",
    };
  }

  try {
    const alert = await db.civicReport.update({
      where: {
        id: alertId,
      },
      data: {
        isSpam: true,
      },
    });

    return alert;
  } catch (error) {
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function voteCivicReport(
  isUpvote: boolean,
  userId: string,
  reportId: string
) {
  if (!userId || !reportId) {
    return {
      daat: null,
      error: "Invalid request",
    };
  }

  try {
    // use a transaction to -
    // 1. not let upvote or downvote if they want to do it again
    // 2. if they want to perform the opposite action of what they did before, then remove them from the other
    // 3. increment/decrement the user points based on the action

    const report = await db.civicReport.findUnique({
      where: {
        id: reportId,
      },
      include: {
        upvotedBy: true,
        downvotedBy: true,
      },
    });

    if (!report) {
      return {
        data: null,
        error: "Report not found",
      };
    }

    const cantVote = isUpvote
      ? report.upvotedBy.some((user) => user.id === userId)
      : report.downvotedBy.some((user) => user.id === userId);

    if (cantVote) {
      return {
        data: null,
        error: "You can't perform the same action again.",
      };
    }

    const oppositeVotes = isUpvote ? report.downvotedBy : report.upvotedBy;

    await db.civicReport.update({
      where: {
        id: reportId,
      },
      data: {
        upvotes: isUpvote
          ? report.upvotes + 1
          : report.upvotes > 0
          ? report.upvotes - 1
          : 0,
        downvotes: isUpvote
          ? report.downvotes > 0
            ? report.downvotes - 1
            : 0
          : report.downvotes + 1,
        upvotedBy: isUpvote
          ? {
              connect: {
                id: userId,
              },
            }
          : {
              disconnect: oppositeVotes.map((user) => ({
                id: user.id,
              })),
            },
        downvotedBy: isUpvote
          ? {
              disconnect: oppositeVotes.map((user) => ({
                id: user.id,
              })),
            }
          : {
              connect: {
                id: userId,
              },
            },
      },
    });

    revalidatePath("/feed");

    return {
      error: null,
      data: report,
    };
  } catch (error) {
    return {
      data: null,
      error: "An unknown error occurred",
    };
  }
}

export async function upVoteGovernmentReport(userId: string, reportId: string) {
  if (!userId || !reportId) {
    return {
      data: null,
      error: "Invalid request",
    };
  }

  console.log(userId, reportId);

  try {
    const report = await db.governmentReport.findUnique({
      where: {
        id: reportId,
      },
      include: {
        upvotedBy: true,
      },
    });

    if (!report) {
      return {
        data: null,
        error: "Report not found",
      };
    }

    const cantVote = report.upvotedBy.some((user) => user.id === userId);

    if (cantVote) {
      return {
        data: null,
        error: "You can't perform the same action again.",
      };
    }

    await db.governmentReport.update({
      where: {
        id: reportId,
      },
      data: {
        upvotes: report.upvotes + 1,
        upvotedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    revalidatePath("/feed");

    return {
      data: report,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "An unknown error occurred",
    };
  }
}

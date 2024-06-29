import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { SetStateAction } from "react";

export default function Create({
  setShowCivicReportDialog,
  setShowGovernmentReportDialog,
}: {
  setShowCivicReportDialog: (value: SetStateAction<boolean>) => void;
  setShowGovernmentReportDialog: (value: SetStateAction<boolean>) => void;
}) {
  return (
    <div className="flex flex-col fixed bottom-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} className="px-2 bg-zinc-100">
            <PlusIcon size={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowCivicReportDialog(true)}>
            <DropdownMenuLabel>Civic Report</DropdownMenuLabel>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowGovernmentReportDialog(true)}>
            <DropdownMenuLabel>Government Report</DropdownMenuLabel>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

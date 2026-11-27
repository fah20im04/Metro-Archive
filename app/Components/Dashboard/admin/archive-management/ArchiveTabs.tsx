"use client";

import { FileText, ClipboardList } from "lucide-react";
import type { TabType } from "./types";

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export default function ArchiveTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border">
      <button
        type="button"
        onClick={() => onChange("resources")}
        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
          activeTab === "resources"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileText size={17} />
        All Resources
      </button>

      <button
        type="button"
        onClick={() => onChange("questionPapers")}
        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
          activeTab === "questionPapers"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        <ClipboardList size={17} />
        Question Papers
      </button>
    </div>
  );
}

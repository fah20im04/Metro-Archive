import { Suspense } from "react";

import QuestionBank from "@/app/Components/Dashboard/questionBank/QuestionBank";
import { getQuestionPapersAction } from "@/actions/questionPaper";

function QuestionBankLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-surface-secondary" />
        <div className="h-8 w-64 rounded bg-surface-secondary" />
        <div className="h-4 w-80 max-w-full rounded bg-surface-secondary" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-52 rounded-xl border border-border bg-surface-secondary"
          />
        ))}
      </div>
    </div>
  );
}

async function QuestionBankContent() {
  const result = await getQuestionPapersAction();

  return <QuestionBank questions={result.papers ?? []} />;
}

export default function Page() {
  return (
    <Suspense fallback={<QuestionBankLoading />}>
      <QuestionBankContent />
    </Suspense>
  );
}

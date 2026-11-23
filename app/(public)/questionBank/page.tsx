import { Suspense } from "react";

import QuestionBank from "@/app/Components/questionBank/QuestionBank";
import { getResourcesAction } from "@/actions/resource";
import { getCurrentUserAction } from "@/actions/auth";

// Shown while the question papers are loading
function QuestionBankLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 h-24 rounded-xl bg-surface-secondary" />

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 rounded-xl bg-surface-secondary" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-xl border border-border bg-surface-secondary"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

// Fetches the data on the server, then hands it to the UI component
async function QuestionBankContent() {
  const [resourceResult, auth] = await Promise.all([
    getResourcesAction({ resourceType: "Question Paper" }),
    getCurrentUserAction(),
  ]);

  return (
    <QuestionBank
      questions={resourceResult.resources ?? []}
      isLoggedIn={auth.success}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<QuestionBankLoading />}>
      <QuestionBankContent />
    </Suspense>
  );
}
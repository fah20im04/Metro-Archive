import { notFound } from "next/navigation";

import { getFacultyById, getFacultyVoteStatusAction } from "@/actions/faculty";

import FacultyDetails from "@/app/Components/Faculty/FacultyDetails";

interface FacultyDetailsContentProps {
  params: Promise<{ id: string }>;
}

export default async function FacultyDetailsContent({
  params,
}: FacultyDetailsContentProps) {
  const { id } = await params;

  // Fetch faculty profile
  const faculty = await getFacultyById(id);

  if (!faculty) {
    notFound();
  }

  // Check whether the current student has already liked this faculty
  const likeStatus = await getFacultyVoteStatusAction(id);

  return (
    <FacultyDetails
      faculty={faculty}
      hasLiked={likeStatus.success ? likeStatus.hasVoted : false}
      isLoggedIn={likeStatus.isLoggedIn}
    />
  );
}

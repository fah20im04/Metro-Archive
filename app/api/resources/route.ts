
import {
  createResourceAction,
  getResourcesAction,
} from "@/actions/resource";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const result = await getResourcesAction({
    search: searchParams.get("search") || undefined,
    courseCode: searchParams.get("courseCode") || undefined,
    departmentCode: searchParams.get("departmentCode") || undefined,
    resourceType: searchParams.get("resourceType") || undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createResourceAction(body);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 }
    );
  }
}

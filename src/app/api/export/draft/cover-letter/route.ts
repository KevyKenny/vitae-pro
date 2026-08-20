import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { consumeCoverLetterDraft } from "@/lib/export/draft-store";

const querySchema = z.object({
  token: z.string().uuid(),
});

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ token: searchParams.get("token") });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid draft token." }, { status: 400 });
  }

  const document = await consumeCoverLetterDraft(parsed.data.token, user.id);
  if (!document) {
    return NextResponse.json({ error: "Draft expired or not found." }, { status: 404 });
  }

  return NextResponse.json({ document });
}

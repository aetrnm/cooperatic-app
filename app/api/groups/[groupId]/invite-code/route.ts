import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.groupId) {
      return new NextResponse("Group ID Missing", { status: 400 });
    }

    const group = await db.group.update({
      where: {
        id: params.groupId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[GROUP_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { groupId: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.groupId) {
      return new NextResponse("Group ID missing", { status: 400 });
    }

    const group = await db.group.update({
      where: {
        id: params.groupId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[GROUP_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

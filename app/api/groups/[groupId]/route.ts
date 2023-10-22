import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const group = await db.group.delete({
      where: {
        id: params.groupId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[GROUP_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const group = await db.group.update({
      where: {
        id: params.groupId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[GROUP_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

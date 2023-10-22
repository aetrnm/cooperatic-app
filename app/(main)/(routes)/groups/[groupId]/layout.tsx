import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { GroupSidebar } from "@/components/group/group-sidebar";

const GroupIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { groupId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const group = await db.group.findUnique({
    where: {
      id: params.groupId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!group) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <GroupSidebar groupId={params.groupId} />
      </div>
      <main className="h-full pl-60">{children}</main>
    </div>
  );
};

export default GroupIdLayout;

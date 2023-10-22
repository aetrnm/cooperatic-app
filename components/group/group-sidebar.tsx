import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, Star, StarHalf, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { GroupHeader } from "./group-header";
import { GroupSection } from "./group-section";
import { GroupChannel } from "./group-channel";
import { GroupMember } from "./group-member";

interface GroupSidebarProps {
  groupId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.USER]: null,
  [MemberRole.MODERATOR]: <StarHalf className="h-4 w-4 mr-2 text-blue-500" />,
  [MemberRole.ADMIN]: <Star className="h-4 w-4 mr-2 text-red-500" />,
};

export const GroupSidebar = async ({ groupId }: GroupSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = group?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = group?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = group?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = group?.members;

  if (!group) {
    return redirect("/");
  }

  const role = group.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full bg-[#F2F3F5]">
      <GroupHeader group={group} role={role} />
      <ScrollArea className="flex-1 px-3">
        {!!textChannels?.length && (
          <div className="mb-2">
            <GroupSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <GroupChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  group={group}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <GroupSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <GroupChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  group={group}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <GroupSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <GroupChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  group={group}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <GroupSection
              sectionType="members"
              role={role}
              label="Members"
              group={group}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <GroupMember key={member.id} member={member} group={group} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

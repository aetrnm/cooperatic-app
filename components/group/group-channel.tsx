"use client";

import { Channel, ChannelType, Group, MemberRole } from "@prisma/client";
import { Edit, Lock, Mic, Pen, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface GroupChannelProps {
  channel: Channel;
  group: Group;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Pen,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const GroupChannel = ({ channel, group, role }: GroupChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/groups/${params?.groupId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, group });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gray-700/10 transition mb-1",
        params?.channelId === channel.id && "bg-gray-700/10"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-gray-500" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-gray-500 group-hover:text-gray-600 transition",
          params?.channelId === channel.id &&
            "text-primary"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.USER && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden group-hover:block w-4 h-4 text-gray-500 hover:text-gray-600 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-gray-500 hover:text-gray-600 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name.toLowerCase() === "general" && (
        <Lock className="ml-auto w-4 h-4 text-gray-500" />
      )}
    </button>
  );
};

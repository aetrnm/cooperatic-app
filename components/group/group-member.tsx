"use client";

import { Member, MemberRole, Profile, Group } from "@prisma/client";
import { Star, StarHalf } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface GroupMemberProps {
  member: Member & { profile: Profile };
  group: Group;
}

const roleIconMap = {
  [MemberRole.USER]: null,
  [MemberRole.MODERATOR]: <StarHalf className="h-4 w-4 text-blue-500" />,
  [MemberRole.ADMIN]: <Star className="h-4 w-4 text-red-500" />,
};

export const GroupMember = ({ member, group }: GroupMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/groups/${params?.groupId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gray-700/10 transition mb-1",
        params?.memberId === member.id && "bg-gray-700/10"
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className="h-8 w-8" />
      <p
        className={cn(
          "font-semibold text-sm text-gray-500 group-hover:text-gray-600 transition",
          params?.memberId === member.id && "text-primary"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

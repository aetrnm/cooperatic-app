"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-red-600 text-white border-none">
        Not connected. Trying to reconnect every 1s
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-green-600 text-white border-none">
      Connected!
    </Badge>
  );
};

import React from "@moonlight-mod/wp/react";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { Avatar, AvatarSizes } from "@moonlight-mod/wp/discord/components/common/index";

import { ChannelStore, UserStore } from "@moonlight-mod/wp/common_stores";

type MessageAvatarProps = {
  userId: string;
  channelId: string;
};

export default function MessageAvatar({ userId, channelId }: MessageAvatarProps) {
  const user = useStateFromStores([UserStore], () => UserStore.getUser(userId)!, [userId]);
  const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(channelId), [channelId]);
  const guildId = channel?.getGuildId();

  return (
    <Avatar
      // @ts-expect-error fixed next mappings
      className="mentionAvatar"
      src={user.getAvatarURL(guildId, 16)}
      // @ts-expect-error fixed next mappings
      size={AvatarSizes.SIZE_16}
    />
  );
}

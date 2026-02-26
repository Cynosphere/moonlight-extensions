import { ChannelStore, UserStore } from "@moonlight-mod/wp/common_stores";
import { Avatar, AvatarSizes } from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";

type MessageAvatarProps = {
  userId: string | undefined;
  parsedUserId?: string;
  channelId: string;
};

export default function MessageAvatar({ userId, parsedUserId, channelId }: MessageAvatarProps) {
  const user = useStateFromStores([UserStore], () => UserStore.getUser(userId ?? parsedUserId), [userId, parsedUserId]);
  const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(channelId), [channelId]);
  const guildId = channel?.getGuildId();

  return user == null ? null : (
    <Avatar className="mentionAvatar" src={user.getAvatarURL(guildId, 16)} size={AvatarSizes.SIZE_16} />
  );
}

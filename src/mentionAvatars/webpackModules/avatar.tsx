import { ChannelStore, UserStore } from "@moonlight-mod/wp/common_stores";
import Avatar from "@moonlight-mod/wp/discord/design/components/Avatar/web/Avatar";
import { Sizes as AvatarSizes } from "@moonlight-mod/wp/discord/design/components/Avatar/web/AvatarConstants";
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

import { GuildStore } from "@moonlight-mod/wp/common_stores";
import { ChannelTypes } from "@moonlight-mod/wp/discord/Constants";

type MemberListItemProps = {
  user?: any;
  channel?: any;
  isOwner: boolean;
  guildId?: string;
};

export default function getOwner({ user, channel, isOwner, guildId }: MemberListItemProps): boolean {
  if (!user?.id) return isOwner;
  if (channel?.type === ChannelTypes.GROUP_DM) return isOwner;

  return GuildStore.getGuild(guildId ?? channel?.guild_id)?.ownerId === user.id;
}

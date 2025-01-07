import { GuildStore } from "@moonlight-mod/wp/common_stores";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const { ChannelTypes } = spacepack.require("discord/Constants");

type MemberListItemProps = {
  user?: any;
  channel?: any;
  isOwner: boolean;
  guildId?: string;
};

export default function getOwner({ user, channel, isOwner, guildId }: MemberListItemProps): boolean {
  if (!(moonlight.getConfigOption("chatTweaks", "alwaysShowOwnerCrown") ?? true)) return isOwner;

  if (!user?.id) return isOwner;
  if (channel?.type === ChannelTypes.GROUP_DM) return isOwner;

  return GuildStore.getGuild(guildId ?? channel?.guild_id)?.ownerId === user.id;
}

import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

import { addItem, MenuItem, MenuSeparator } from "@moonlight-mod/wp/contextMenu_contextMenu";
import { ToastType, createToast, showToast } from "@moonlight-mod/wp/discord/components/common/index";
import { ChannelTypes, Permissions } from "@moonlight-mod/wp/discord/Constants";
import { GuildChannelStore, PermissionStore, ChannelListStore } from "@moonlight-mod/wp/common_stores";

const { has: hasFlag } = spacepack.require("discord/utils/BigFlagUtils");

const logger = moonlight.getLogger("Voice Text Link");

async function linkChannel(channelMap: Record<string, string>, voice: any, text: any) {
  try {
    channelMap[voice.id] = text.id;
    await moonlight.setConfigOption("voiceTextLink", "channelMap", channelMap);
    showToast(createToast(`Linked "${text.name}" to "${voice.name}"`, ToastType.SUCCESS));
  } catch (err) {
    logger.error(`Failed to link "${text.name}" (${text.id}) to "${voice.name}" (${voice.id}):`, err);
    showToast(createToast("Failed to link text channel", ToastType.FAILURE));
  }
}

addItem(
  "channel-context",
  ({ channel }: { channel: any }) => {
    const channelMap = moonlight.getConfigOption<Record<string, string>>("voiceTextLink", "channelMap") ?? {};
    const linked = channelMap[channel.id] != null;

    const muted = ChannelListStore.getGuildWithoutChangingGuildActionRows(channel.guild_id)?.guildChannels
      ?.mutedChannelIds;

    const textChannels =
      GuildChannelStore.getChannels(channel.guild_id)
        ?.SELECTABLE?.map((c: any) => c.channel)
        ?.filter((c: any) => c.type === ChannelTypes.GUILD_TEXT)
        ?.filter((c: any) => hasFlag(PermissionStore.getChannelPermissions(c), Permissions.SEND_MESSAGES))
        ?.filter((c: any) => !muted.has(c.id) && !muted.has(c.parent_id)) ?? [];
    const likelyChannels = textChannels.filter((c: any) => c.name.includes("voice") || c.name.includes("vc-"));
    const likelyIds = likelyChannels.map((c: any) => c.id);
    const otherChannels = textChannels.filter((c: any) => !likelyIds.includes(c.id));

    return channel.guild_id == null || channel.type !== ChannelTypes.GUILD_VOICE ? null : (
      <MenuItem
        id="voice-text-link"
        label={linked ? "Unlink Text Channel" : "Link To Text Channel"}
        action={
          linked
            ? async () => {
                try {
                  delete channelMap[channel.id];
                  await moonlight.setConfigOption("voiceTextLink", "channelMap", channelMap);
                  showToast(createToast(`Unlinked text channel from "${channel.name}"`, ToastType.SUCCESS));
                } catch (err) {
                  logger.error(`Failed to unlink text channel from "${channel.name}" (${channel.id}):`, err);
                  showToast(createToast("Failed to unlink text channel", ToastType.FAILURE));
                }
              }
            : () => {}
        }
      >
        {linked ? null : likelyChannels.length > 0 ? (
          <>
            {likelyChannels.map((c: any) => (
              <MenuItem
                id={c.id}
                label={`#${c.name}`}
                action={async () => {
                  await linkChannel(channelMap, channel, c);
                }}
              />
            ))}
            <MenuSeparator />
            <MenuItem id="others" label="Other Channels">
              {otherChannels.map((c: any) => (
                <MenuItem
                  id={c.id}
                  label={`#${c.name}`}
                  action={async () => {
                    await linkChannel(channelMap, channel, c);
                  }}
                />
              ))}
            </MenuItem>
          </>
        ) : (
          textChannels.map((c: any) => (
            <MenuItem
              id={c.id}
              label={`#${c.name}`}
              action={async () => {
                await linkChannel(channelMap, channel, c);
              }}
            />
          ))
        )}
      </MenuItem>
    );
  },
  "mute-channel",
  true
);

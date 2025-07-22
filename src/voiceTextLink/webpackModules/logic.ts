import { ChannelStore } from "@moonlight-mod/wp/common_stores";

export function getChannel(channel: any) {
  if (!channel) return channel;

  const channelMap = moonlight.getConfigOption<Record<string, string>>("voiceTextLink", "channelMap") ?? {};
  const id = channelMap[channel.id];
  if (id) {
    const linkedChannel = ChannelStore.getChannel(id);
    if (linkedChannel) {
      return linkedChannel;
    } else {
      return channel;
    }
  } else {
    return channel;
  }
}

export function getChannelId(id: string) {
  const channelMap = moonlight.getConfigOption<Record<string, string>>("voiceTextLink", "channelMap") ?? {};
  return channelMap[id] ?? id;
}

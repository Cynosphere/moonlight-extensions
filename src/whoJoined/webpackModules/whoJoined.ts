import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import {
  VoiceStateStore,
  GuildMemberStore,
  UserStore,
  ChannelStore,
  RelationshipStore
} from "@moonlight-mod/wp/common_stores";

const { ChannelTypes } = spacepack.require("discord/Constants");

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

type VoiceState = {
  guildId?: string;
  userId: string;
  channelId: string;
};

function getName(userId: string, guildId?: string): string {
  const aliases = moonlight.getConfigOption<Record<string, string>>("whoJoined", "aliases") ?? {};

  if (aliases[userId]) return aliases[userId];

  const user = UserStore.getUser(userId);
  if (moonlight.getConfigOption<boolean>("whoJoined", "username") ?? false) return user.username;

  let nick: string;
  if (moonlight.getConfigOption<boolean>("whoJoined", "friendNicknames") ?? true)
    nick = RelationshipStore.getNickname(userId);
  if ((moonlight.getConfigOption<boolean>("whoJoined", "serverNicknames") ?? true) && guildId && nick! == null)
    nick = GuildMemberStore.getNick(guildId, userId);
  if (nick! == null) nick = user.globalName ?? user.username;

  return nick;
}

Dispatcher.addInterceptor(({ type, voiceStates }: { type: string; voiceStates: VoiceState[] }): boolean => {
  if (type !== "VOICE_STATE_UPDATES") return false;

  const selfId = UserStore.getCurrentUser().id;

  for (const { guildId, userId, channelId } of voiceStates) {
    const currentChannelId = VoiceStateStore.getCurrentClientVoiceChannelId(guildId);
    const oldState = VoiceStateStore.getVoiceState(guildId, userId);

    if (currentChannelId == null || selfId === userId || oldState?.channelId === channelId) continue;

    if (
      ChannelStore.getChannel(currentChannelId).type === ChannelTypes.GUILD_STAGE_VOICE &&
      !(moonlight.getConfigOption<boolean>("whoJoined", "allowStage") ?? false)
    )
      continue;

    let name = getName(userId, guildId);
    if (oldState?.channelId === currentChannelId && oldState.channelId !== channelId) {
      name = getName(oldState.userId, guildId);
      speak(`${name} left`);
    } else if (channelId === currentChannelId) {
      speak(`${name} joined`);
    }
  }

  return false;
});

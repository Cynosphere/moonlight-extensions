import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";

Dispatcher.addInterceptor((event) => {
  if (event.type !== "VOICE_STATE_UPDATES") return false;
  const ids = moonlight.getConfigOption<string[]>("voiceStateSuppressor", "ids") ?? [];

  event.voiceStates = event.voiceStates.filter((state: { guildId: string }) => !ids.includes(state.guildId));

  if (event.voiceStates.length === 0) return true;

  return false;
});

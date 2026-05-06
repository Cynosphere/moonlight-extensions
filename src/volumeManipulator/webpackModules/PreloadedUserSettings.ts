import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

type VolumeRecord = { localVolumes: Record<string, number> };
type AudioContextSettings = Record<"user" | "stream", Record<string, { volume?: number }>>;

let MediaEngineStore: any;

export function _cleanseVolumes(audioContextSettings: AudioContextSettings) {
  // lazy loaded because PreloadedUserSettings loads way earlier than common_stores on multi-webpack
  if (MediaEngineStore == null) {
    if (spacepack.require.m["common_stores"] != null)
      MediaEngineStore = spacepack.require("common_stores").MediaEngineStore;
  }

  if (MediaEngineStore != null) {
    const userSettings: VolumeRecord = MediaEngineStore.getSettings("default");
    const streamSettings: VolumeRecord = MediaEngineStore.getSettings("stream");
    for (const userId in audioContextSettings.user) {
      const localUserVolume = userSettings.localVolumes[userId];
      if (localUserVolume > 199) {
        audioContextSettings.user[userId] ??= { volume: localUserVolume };
        audioContextSettings.user[userId].volume = localUserVolume;
      }
    }
    for (const userId in audioContextSettings.stream) {
      if (streamSettings.localVolumes[userId] > 199) {
        audioContextSettings.stream[userId] ??= {};
        audioContextSettings.stream[userId].volume = streamSettings.localVolumes[userId];
      }
    }
  }
  return audioContextSettings;
}

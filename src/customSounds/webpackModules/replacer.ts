export default function getReplacement(name: string): string | undefined {
  const sounds = moonlight.getConfigOption<Record<string, string>>("customSounds", "sounds") ?? {};
  const sound = sounds[name];

  return sound === "" ? undefined : sound;
}

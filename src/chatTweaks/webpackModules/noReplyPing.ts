export default function shouldMention(message: any, event: KeyboardEvent, isSelf: boolean): boolean {
  if (isSelf) return false;
  const enabled = moonlight.getConfigOption<boolean>("chatTweaks", "noReplyPing") ?? true;
  const invertList = moonlight.getConfigOption<boolean>("chatTweaks", "noReplyPingInvert") ?? false;
  const list = moonlight.getConfigOption<string[]>("chatTweaks", "noReplyPingList") ?? [];

  if (!enabled) return !event.shiftKey;

  if (list.length > 0) {
    let ping = true;
    if (list.includes(message.author.id)) {
      ping = false;
    }

    if (invertList) ping = !ping;
    if (event.shiftKey) ping = !ping;

    return ping;
  } else {
    return event.shiftKey;
  }
}

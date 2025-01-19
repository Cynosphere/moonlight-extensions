export default function shouldMention(message: any, event: KeyboardEvent, isSelf: boolean): boolean {
  if (isSelf) return false;
  const invertList = moonlight.getConfigOption<boolean>("noReplyPing", "invertList") ?? false;
  const list = moonlight.getConfigOption<string[]>("noReplyPing", "disabledPingList") ?? [];

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

import { ChannelStore, GuildMemberStore, GuildStore, UserStore } from "@moonlight-mod/wp/common_stores";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import type { DisplayNameFontProps } from "./_types";

const classnames = spacepack.require("classnames");

const getDisplayNameStylesFont = spacepack.findFunctionByStrings(
  spacepack.findByCode('location:"useDisplayNameStylesFont"')?.[0]?.exports ?? {},
  "return{name:"
) as (props: DisplayNameFontProps) => { name: string; className: string };
const DisplayNameFontClasses = spacepack.findByCode(':"dnsFont_')?.[0]?.exports ?? {};

export default function modifyMentionProps(props: Record<string, any>, mentionProps: Record<string, any>) {
  const { userId, parsedUserId, channelId, className } = props;
  const user = UserStore.getUser(userId ?? parsedUserId);
  const channel = ChannelStore.getChannel(channelId);
  const guildId = channel?.getGuildId();
  const guild = GuildStore.getGuild(guildId);
  const member = GuildMemberStore.getMember(guildId, userId);

  const { colorString, colorStrings } = member ?? {};

  const displayNameStyles = member?.displayNameStyles ?? user?.displayNameStyles;
  let fontClass = getDisplayNameStylesFont?.(displayNameStyles?.fontId)?.className ?? "";
  if (fontClass !== "") {
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1 && ua.indexOf("version/") !== -1;
    fontClass = classnames(spacepack.findObjectFromValueSubstring(DisplayNameFontClasses, "dnsFont_"), fontClass, {
      [spacepack.findObjectFromValueSubstring(DisplayNameFontClasses, "safari_")]: isSafari
    });
  }

  if ((!member || !colorString) && fontClass === "") return mentionProps;

  return user == null
    ? mentionProps
    : {
        ...mentionProps,
        color: colorString != null ? parseInt(colorString.replace("#", "0x"), 16) : null,
        roleColors: guild?.features?.has("ENHANCED_ROLE_COLORS") ? colorStrings : null,
        className: classnames(className ?? "", fontClass)
      };
}

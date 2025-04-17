import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { GuildMemberStore } from "@moonlight-mod/wp/common_stores";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";

const useGradient = spacepack.findFunctionByStrings(
  spacepack.findByCode('"--custom-gradient-color-1":null!=')?.[0]?.exports ?? {},
  ".useMemo("
);

const classnames = spacepack.require("classnames");

type NameColorProps = {
  children: React.ReactNode;
  userId: string;
  guildId: string;
  speaking?: boolean;
};

export default function ColorConsistencyWrapper({
  children,
  userId,
  guildId,
  speaking
}: NameColorProps): React.ReactNode {
  const member = useStateFromStores([GuildMemberStore], () => GuildMemberStore.getMember(guildId, userId), [
    userId,
    guildId
  ]);
  const { colorString, colorStrings } = member ?? {};
  const shouldUseGradient = colorStrings?.primaryColor && colorStrings.secondaryColor;
  const { text, gradient } =
    useGradient?.(colorStrings?.primaryColor, colorStrings?.secondaryColor, colorStrings?.tertiaryColor, "username") ??
    {};

  if (!member || !colorString) return children;

  return (
    <span
      style={{
        color: !shouldUseGradient ? colorString : null,
        filter: speaking ? "brightness(1.75)" : null,
        ...(shouldUseGradient ? text.gradientStyle : {})
      }}
      className={classnames("", {
        [text.gradientClassName]: shouldUseGradient,
        [gradient.gradientClassName]: shouldUseGradient
      })}
    >
      {children}
    </span>
  );
}

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
  let gradientClassname, gradientStyle;

  try {
    const gradientRole =
      useGradient?.({ ...(colorStrings ?? {}), roleStyle: "username", includeConvenienceGlow: false }) ?? {};
    gradientClassname = gradientRole.gradientClassname;
    gradientStyle = gradientRole.gradientStyle;
  } catch {
    // noop
  }

  if (!member || !colorString) return children;

  return (
    <span
      style={{
        color: colorString,
        filter: speaking ? "brightness(1.75)" : null,
        ...(gradientStyle ?? {})
      }}
      className={classnames("", gradientClassname ?? {})}
    >
      {children}
    </span>
  );
}

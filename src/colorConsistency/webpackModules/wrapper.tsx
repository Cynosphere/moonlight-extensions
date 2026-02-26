import { GuildMemberStore, UserStore } from "@moonlight-mod/wp/common_stores";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import type { CSSProperties } from "react";

type GradientProps = {
  primary: string;
  secondary?: string;
  tertiary?: string;
  roleStyle: string;
  includeConvenienceGlow: boolean;
};
type Gradient = {
  gradientClassname: string;
  gradientStyle: CSSProperties;
};

type DisplayNameFontProps = {
  displayNameStyles: Record<string, any>; // FIXME
  inProfile: boolean;
};

const useGradient = spacepack.findFunctionByStrings(
  spacepack.findByCode(`"--custom-gradient-color-2":`)?.[0]?.exports ?? {},
  ".useMemo("
) as (props: GradientProps, className?: string) => Gradient;
const useDisplayNameStylesFont = spacepack.findFunctionByStrings(
  spacepack.findByCode('location:"useDisplayNameStylesFont"')?.[0]?.exports ?? {},
  'location:"useDisplayNameStylesFont"'
) as (props: DisplayNameFontProps) => string;

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
  const user = useStateFromStores([UserStore], () => UserStore.getUser(userId), [userId]);

  const { colorString, colorStrings } = member ?? {};
  let gradientClassname: string = "",
    gradientStyle: CSSProperties = {};

  const displayNameStyles = member?.displayNameStyles ?? user?.displayNameStyles;
  const fontClass = useDisplayNameStylesFont?.({ displayNameStyles, inProfile: false });

  try {
    const gradientRole =
      useGradient?.({ ...(colorStrings ?? {}), roleStyle: "username", includeConvenienceGlow: false }) ?? {};
    gradientClassname = gradientRole.gradientClassname;
    gradientStyle = gradientRole.gradientStyle;
  } catch {
    // noop
  }

  if ((!member || !colorString) && !fontClass) return children;

  return (
    <span
      style={{
        color: colorString,
        filter: speaking ? "brightness(1.75)" : undefined,
        ...gradientStyle
      }}
      className={classnames("", gradientClassname, fontClass ?? "")}
    >
      {children}
    </span>
  );
}

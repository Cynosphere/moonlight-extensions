import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import {
  Tooltip,
  ScreenIcon,
  MobilePhoneIcon,
  GlobeEarthIcon,
  GameControllerIcon
} from "@moonlight-mod/wp/discord/components/common/index";

import MemberList from "@moonlight-mod/wp/componentEditor_memberList";
import DMList from "@moonlight-mod/wp/componentEditor_dmList";
import Messages from "@moonlight-mod/wp/componentEditor_messages";

import { AuthenticationStore, PresenceStore, SessionsStore } from "@moonlight-mod/wp/common_stores";

type Platforms = "desktop" | "mobile" | "web" | "embedded" | "unknown";
const IconsForPlatform: Record<Exclude<Platforms, "unknown">, React.ComponentType<IconsProps>> = {
  desktop: ScreenIcon,
  mobile: MobilePhoneIcon,
  web: GlobeEarthIcon,
  embedded: GameControllerIcon
};

const { humanizeStatus } = spacepack.findByExports("humanizeStatus")[0].exports.ZP;

type Statuses = "online" | "idle" | "dnd" | "offline" | "invisible";
const StatusColors: Record<Exclude<Statuses, "offline" | "invisible">, string> = {
  online: "var(--green-360, var(--status-green-600))",
  idle: "var(--yellow-300, var(--status-yellow-500))",
  dnd: "var(--red-400, var(--status-red-500))"
};

type IconsProps = {
  user: any;
  extraClasses: string[];
  configKey: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "custom" | "refresh_sm";
  width?: number;
  height?: number;
};

type Session = {
  clientInfo: {
    client: Platforms;
  };
  status: Statuses;
};

export default function PlatformIcons({ user, extraClasses, configKey, size = "xs", width, height }: IconsProps) {
  const bots = moonlight.getConfigOption<boolean>("platformIcons", "bots") ?? false;
  const self = moonlight.getConfigOption<boolean>("platformIcons", "self") ?? true;
  const enabled = moonlight.getConfigOption<boolean>("platformIcons", configKey) ?? true;

  const platforms = useStateFromStores(
    [AuthenticationStore, PresenceStore, SessionsStore],
    () =>
      self && AuthenticationStore.getId() === user?.id
        ? Object.values(SessionsStore.getSessions())
            .filter((session) => (session as Session).clientInfo.client !== "unknown")
            .map((session) => ({ [(session as Session).clientInfo.client]: (session as Session).status }))
            .reduce((obj, item) => Object.assign(obj, item), {})
        : (PresenceStore.getState()?.clientStatuses?.[user?.id] ?? {}),
    [user, self]
  );

  const elements = React.useMemo(() => {
    const elements = [];

    for (const platform of Object.keys(platforms)) {
      const status = platforms[platform];

      const props = {
        text: `${humanizeStatus(status, false)} on ${platform.charAt(0).toUpperCase()}${platform.slice(1)}`,
        key: `platform-icons-tooltip-${platform}`
      };
      const Icon = IconsForPlatform[platform as Exclude<Platforms, "unknown">];
      const color = StatusColors[status as Exclude<Statuses, "offline" | "invisible">];

      elements.push(
        <Tooltip {...props}>
          {(tooltipProps: any) => (
            <Icon
              {...tooltipProps}
              color={color}
              size={size}
              width={width}
              height={height}
              key={`platform-icons-icon-${platform}`}
            />
          )}
        </Tooltip>
      );
    }

    return elements;
  }, [platforms]);

  return !enabled || (!bots && user?.bot) || elements.length === 0 ? null : (
    <div className={["platform-icons-wrapper", ...extraClasses].join(" ")}>{elements}</div>
  );
}

DMList.addDecorator("platformIcons", (props: any) => (
  <PlatformIcons user={props.user} configKey="directMessages" extraClasses={["platform-icons-private-message"]} />
));
MemberList.addDecorator(
  "platformIcons",
  (props: any) => (
    <PlatformIcons user={props.user} configKey="memberList" extraClasses={["platform-icons-member-list"]} />
  ),
  "bot-tag"
);
Messages.addUsernameBadge(
  "platformIcons",
  (props: any) => (
    <PlatformIcons
      user={props.message.author}
      configKey="messages"
      extraClasses={["platform-icons-message"]}
      size="sm"
    />
  ),
  "role-icon"
);

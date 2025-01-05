import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";

import { AuthenticationStore, PresenceStore, SessionsStore } from "@moonlight-mod/wp/common_stores";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { Tooltip, ScreenIcon, MobilePhoneIcon, GlobeEarthIcon, GameControllerIcon } = Components;

const IconsForPlatform = {
  desktop: ScreenIcon,
  mobile: MobilePhoneIcon,
  web: GlobeEarthIcon,
  embedded: GameControllerIcon
};

const { humanizeStatus } = spacepack.findByExports("humanizeStatus")[0].exports.ZP;

const StatusColors = {
  online: "var(--green-360, var(--status-green-600))",
  idle: "var(--yellow-300, var(--status-yellow-500))",
  dnd: "var(--red-400, var(--status-red-500))"
};

type IconsProps = {
  user: any;
  extraClasses: string[];
  size: "xxs" | "xs" | "sm" | "md" | "lg" | "custom" | "refresh_sm";
  width?: number;
  height?: number;
};

type Session = {
  clientInfo: {
    client: "desktop" | "mobile" | "web" | "embedded" | "unknown";
  };
  status: "online" | "idle" | "dnd" | "offline" | "invisible";
};

export default function PlatformIcons({ user, extraClasses, size = "xs", width, height }: IconsProps) {
  const bots = moonlight.getConfigOption<Boolean>("platformIcons", "bots") ?? false;
  const self = moonlight.getConfigOption<Boolean>("platformIcons", "self") ?? true;

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
      // @ts-expect-error
      const Icon = IconsForPlatform[platform];

      elements.push(
        <Tooltip {...props}>
          {(tooltipProps: any) => (
            <Icon
              {...tooltipProps}
              /* @ts-expect-error */
              color={StatusColors[status]}
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

  return (!bots && user?.bot) || elements.length == 0 ? null : (
    <div className={["platform-icons-wrapper", ...extraClasses].join(" ")}>{elements}</div>
  );
}

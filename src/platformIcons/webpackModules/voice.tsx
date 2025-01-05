import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";

import { VoiceStateStore } from "@moonlight-mod/wp/common_stores";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { Tooltip, MobilePhoneIcon, GameControllerIcon } = Components;

const VoicePlatforms = spacepack.findObjectFromKey(
  spacepack.findByCode('.PLAYSTATION=3]="PLAYSTATION"')[0].exports,
  "PLAYSTATION"
);

const PlatformNames = {
  [VoicePlatforms.MOBILE]: "mobile",
  [VoicePlatforms.PLAYSTATION]: "PlayStation",
  [VoicePlatforms.XBOX]: "Xbox"
};

const VoiceClasses = spacepack.findByCode("iconPriortySpeakerSpeaking:")[0].exports;

type PlatformIconVoiceProps = {
  channelId: string;
  user: any;
};

export default function PlatformIconVoice({ channelId, user }: PlatformIconVoiceProps) {
  const enabled = moonlight.getConfigOption("platformIcons", "voice") ?? true;

  const platform = useStateFromStores(
    [VoiceStateStore],
    () => VoiceStateStore.getVoicePlatformForChannel(channelId, user.id),
    [channelId, user]
  );

  const Icon = React.useMemo(
    () => (platform == VoicePlatforms.MOBILE ? MobilePhoneIcon : GameControllerIcon),
    [platform]
  );
  const tooltipText = React.useMemo(() => `Connected via ${PlatformNames[platform]}`, [platform]);

  // @ts-expect-error only not inlining this so i dont suppress all errors on the line
  const isOverlay = window.__OVERLAY__;

  return isOverlay || !enabled || !platform || platform === VoicePlatforms.DESKTOP ? null : (
    <Tooltip text={tooltipText}>
      {(tooltipProps: any) => <Icon {...tooltipProps} className={VoiceClasses.icon} color="currentColor" />}
    </Tooltip>
  );
}

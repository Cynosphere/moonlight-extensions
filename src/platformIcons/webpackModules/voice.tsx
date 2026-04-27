import { VoiceStateStore } from "@moonlight-mod/wp/common_stores";
import Tooltip from "@moonlight-mod/wp/discord/design/components/Tooltip/web/VoidTooltip";
import GameControllerIcon from "@moonlight-mod/wp/discord/modules/icons/web/GameControllerIcon";
import MobilePhoneIcon from "@moonlight-mod/wp/discord/modules/icons/web/MobilePhoneIcon";
import VrHeadsetIcon from "@moonlight-mod/wp/discord/modules/icons/web/VrHeadsetIcon";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const VoicePlatforms = spacepack.findObjectFromKey(
  spacepack.findByCode('.PLAYSTATION=3]="PLAYSTATION"')[0].exports,
  "PLAYSTATION"
);

const PlatformNames = {
  [VoicePlatforms.MOBILE]: "mobile",
  [VoicePlatforms.PLAYSTATION]: "PlayStation",
  [VoicePlatforms.XBOX]: "Xbox",
  [VoicePlatforms.QUEST]: "VR"
};
const PlatformIcons = {
  [VoicePlatforms.MOBILE]: MobilePhoneIcon,
  [VoicePlatforms.PLAYSTATION]: GameControllerIcon,
  [VoicePlatforms.XBOX]: GameControllerIcon,
  [VoicePlatforms.QUEST]: VrHeadsetIcon
};

const VoiceClasses = spacepack.findByCode('"iconPriortySpeakerSpeaking_')[0].exports;
const iconClass = spacepack.findObjectFromValueSubstring(VoiceClasses, "icon_");

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

  const Icon = React.useMemo(() => PlatformIcons[platform] ?? React.Fragment, [platform]);
  const tooltipText = React.useMemo(() => `Connected on ${PlatformNames[platform]}`, [platform]);

  // @ts-expect-error only not inlining this so i dont suppress all errors on the line
  const isOverlay = window.__OVERLAY__;

  return isOverlay || !enabled || !platform || platform !== VoicePlatforms.MOBILE ? null : (
    <Tooltip text={tooltipText}>
      {(tooltipProps: any) => <Icon {...tooltipProps} className={iconClass} color="currentColor" />}
    </Tooltip>
  );
}

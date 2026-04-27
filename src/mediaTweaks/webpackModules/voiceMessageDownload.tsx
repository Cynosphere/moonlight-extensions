import DownloadIcon from "@moonlight-mod/wp/discord/modules/icons/web/DownloadIcon";
import PanelButton from "@moonlight-mod/wp/discord/components/common/PanelButton";
import React from "@moonlight-mod/wp/react";
import i18n from "@moonlight-mod/wp/discord/intl";

export default function VoiceMessageDownloadButton({
  src,
  iconClassName
}: {
  src: string;
  className: string;
  iconClassName: string;
}) {
  if (!moonlight.getConfigOption<boolean>("mediaTweaks", "voiceMessageDownload")) return;

  return (
    <PanelButton
      icon={DownloadIcon}
      tooltipText={i18n.intl.string(i18n.t["1WjMbC"])}
      onClick={() => window.open(src)}
      innerClassName={iconClassName}
    />
  );
}

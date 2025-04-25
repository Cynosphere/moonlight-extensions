import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { DownloadIcon, Button, Tooltip } from "@moonlight-mod/wp/discord/components/common/index";

const i18n = spacepack.require("discord/intl");
const { intl } = i18n;

export default function VoiceMessageDownloadButton({
  src,
  className,
  iconClassName
}: {
  src: string;
  className: string;
  iconClassName: string;
}) {
  if (!moonlight.getConfigOption<boolean>("mediaTweaks", "voiceMessageDownload")) return;

  return (
    <Tooltip text={intl.string(i18n.t["1WjMbG"])}>
      {(tooltipProps: any) => (
        <Button
          {...tooltipProps}
          className={className}
          size={Button.Sizes.NONE}
          look={Button.Looks.BLANK}
          onClick={() => window.open(src)}
        >
          <DownloadIcon color="currentColor" className={iconClassName} />
        </Button>
      )}
    </Tooltip>
  );
}

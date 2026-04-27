import Clickable from "@moonlight-mod/wp/discord/design/components/Clickable/web/Clickable";
import { createToast } from "@moonlight-mod/wp/discord/design/components/Toast/web/Toast";
import { showToast } from "@moonlight-mod/wp/discord/design/components/Toast/web/ToastAPI";
import { ToastType } from "@moonlight-mod/wp/discord/design/components/Toast/web/ToastConstants";
import Tooltip from "@moonlight-mod/wp/discord/design/components/Tooltip/web/VoidTooltip";
import CopyIcon from "@moonlight-mod/wp/discord/modules/icons/web/CopyIcon";
import { copy } from "@moonlight-mod/wp/discord/utils/ClipboardUtils";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const i18n = spacepack.require("discord/intl");
const intl = spacepack.findObjectFromKey(i18n, "_forceLookupMatcher");

const logger = moonlight.getLogger("Better Codeblocks");

export default function PreviewCopyButton({ fileContents, language }: { fileContents: string; language: string }) {
  return (
    <Tooltip text={intl.string(i18n.t.JrGD7E)}>
      {(tooltipProps: any) => (
        <Clickable
          {...tooltipProps}
          style={{ cursor: "pointer", marginInlineEnd: "var(--space-16)" }}
          onClick={() => {
            try {
              copy(fileContents);
              showToast(createToast(intl.string(i18n.t.mGZ66D), ToastType.SUCCESS));
            } catch (err) {
              logger.error("Failed to copy from preview:", err);
              showToast(createToast("Failed to copy", ToastType.FAILURE));
            }
          }}
          onContextMenu={() => {
            try {
              copy(`\`\`\`${language ?? ""}\n${fileContents}\n\`\`\``);
              showToast(createToast("Copied with codeblock", ToastType.SUCCESS));
            } catch (err) {
              logger.error("Failed to copy from preview:", err);
              showToast(createToast("Failed to copy", ToastType.FAILURE));
            }
          }}
        >
          <CopyIcon size="sm" color="currentcolor" />
        </Clickable>
      )}
    </Tooltip>
  );
}

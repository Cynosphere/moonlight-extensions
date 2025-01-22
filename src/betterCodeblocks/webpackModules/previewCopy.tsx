import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { copy } from "@moonlight-mod/wp/discord/utils/ClipboardUtils";
import {
  Clickable,
  CopyIcon,
  Tooltip,
  ToastType,
  createToast,
  showToast
} from "@moonlight-mod/wp/discord/components/common/index";

const i18n = spacepack.findByCode("intl:")[0].exports;

const logger = moonlight.getLogger("Better Codeblocks");

export default function PreviewCopyButton({ fileContents, language }: { fileContents: string; language: string }) {
  return (
    <Tooltip text={i18n.intl.string(i18n.t.JrGD7O)}>
      {(tooltipProps) => (
        <Clickable
          {...tooltipProps}
          style={{ cursor: "pointer" }}
          onClick={() => {
            try {
              copy(fileContents);
              showToast(createToast(i18n.intl.string(i18n.t.mGZ66O), ToastType.SUCCESS));
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
          <CopyIcon size="md" color="currentcolor" />
        </Clickable>
      )}
    </Tooltip>
  );
}

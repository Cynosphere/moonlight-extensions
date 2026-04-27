import Clickable from "@moonlight-mod/wp/discord/design/components/Clickable/web/Clickable";
import Tooltip from "@moonlight-mod/wp/discord/design/components/Tooltip/web/VoidTooltip";
import { hoverButton, hoverButtonGroup } from "@moonlight-mod/wp/discord/modules/chat/web/ImageHoverButtons.css";
import MaximizeIcon from "@moonlight-mod/wp/discord/modules/icons/web/MaximizeIcon";
import { openMediaModal } from "@moonlight-mod/wp/discord/modules/media_viewer/web/components/openMediaModal";
import React from "@moonlight-mod/wp/react";

type HoverButtonsProps = {
  mimeType: string[];
  item: Record<string, any>;
};

type VideoProps = {
  video: {
    width: number;
    height: number;
    proxyURL: string;
    url: string;
  };
};

/*type MimeType = {
  source: string;
  extensions?: string[];
  compressible?: boolean;
};

const MimeTypes = Object.entries(
  spacepack.findByCode(`JSON.parse('{"application/1d-interleaved-parityfec":`)[0].exports
);*/

export default function EnlargeVideoButton({ mimeType, item }: HoverButtonsProps) {
  return mimeType?.[0] !== "video" ? null : (
    <Tooltip text="Enlarge Video">
      {(tooltipProps: any) => (
        <Clickable
          {...tooltipProps}
          className={hoverButton}
          focusProps={{ offset: 2 }}
          aria-label="Enlarge Video"
          onClick={() => {
            if (openMediaModal != null) {
              openMediaModal({
                items: [
                  {
                    url: item.originalItem.proxy_url ?? item.originalItem.media.proxyUrl,
                    proxyUrl: item.originalItem.proxy_url ?? item.originalItem.media.proxyUrl,
                    width: item.originalItem.width ?? item.originalItem.media.width,
                    height: item.originalItem.height ?? item.originalItem.media.height,
                    type: "VIDEO",
                    original: item.originalItem.url ?? item.originalItem.media.url
                  }
                ]
              });
            }
          }}
        >
          <MaximizeIcon size="custom" color="currentColor" width={20} height={20} />
        </Clickable>
      )}
    </Tooltip>
  );
}

export function createButtonGroup({ video }: VideoProps) {
  //const urlObj = new URL(video.proxyURL);
  //const filename = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1);
  //const extension = filename.substring(filename.lastIndexOf(".") + 1);
  const contentType = "video/unknown";
  const mimeType = contentType.split("/");

  return function MediaTweaksHoverButtons() {
    return (
      <div className={hoverButtonGroup}>
        <EnlargeVideoButton
          mimeType={mimeType}
          item={{
            contentType,
            originalItem: {
              proxy_url: video.proxyURL,
              url: video.url,
              width: video.width,
              height: video.height
            }
          }}
        />
      </div>
    );
  };
}

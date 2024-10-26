import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { Clickable, Tooltip, MaximizeIcon, openModal } = Components;

const HoverButtonClasses = spacepack.findByExports("hoverButton")[0].exports;

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

type MimeType = {
  source: string;
  extensions?: string[];
  compressible?: boolean;
};

const LazyMediaModal = spacepack.findFunctionByStrings(spacepack.findByCode(/let{location:.,contextKey:/, "openModalLazy")[0]?.exports ?? {}, "openModalLazy");
const MediaModalClasses = spacepack.findByCode(/\.exports={modal:"modal_[a-z0-9]+"}/)[0].exports;

const MimeTypes = Object.entries(
  spacepack.findByCode(`JSON.parse('{"application/1d-interleaved-parityfec":`)[0].exports
);

export default function EnlargeVideoButton({ mimeType, item }: HoverButtonsProps) {
  return mimeType?.[0] !== "video" ? null : (
    <Tooltip text="Enlarge Video">
      {(tooltipProps: any) => (
        <Clickable
          {...tooltipProps}
          className={HoverButtonClasses.hoverButton}
          focusProps={{ offset: 2 }}
          aria-label="Enlarge Video"
          onClick={() => {
            if (LazyMediaModal != null) {
              LazyMediaModal({
                className: MediaModalClasses.modal,
                items: [
                  {
                    url: item.originalItem.proxy_url,
                    proxyUrl: item.originalItem.proxy_url,
                    width: item.originalItem.width,
                    height: item.originalItem.height,
                    type: "VIDEO",
                    origina: item.originalItem.proxy_url
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
  const urlObj = new URL(video.proxyURL);
  const filename = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1);
  const extension = filename.substring(filename.lastIndexOf(".") + 1);
  const contentType =
    MimeTypes.find(([mime, data]) => (data as MimeType).extensions?.includes(extension))?.[0] ?? "unknown/unknown";
  const mimeType = contentType.split("/");

  return function MediaTweaksHoverButtons() {
    return (
      <div className={HoverButtonClasses.hoverButtonGroup}>
        <EnlargeVideoButton
          mimeType={mimeType}
          item={{
            contentType,
            originalItem: {
              proxy_url: video.proxyURL,
              url: video.proxyURL,
              width: video.width,
              height: video.height
            }
          }}
        />
      </div>
    );
  };
}

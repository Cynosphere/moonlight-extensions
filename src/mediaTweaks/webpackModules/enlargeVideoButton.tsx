import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { Clickable, Tooltip, MaximizeIcon, openModal, ModalRoot, ModalSize } = Components;

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

const createMediaModal = spacepack.findFunctionByStrings(
  spacepack.findByCode(".zoomedCarouselModalRoot,items:")[0].exports,
  '.searchParams.append("format","webp")'
);

const MediaModalClasses = spacepack.findByExports("modal", "image")[0].exports;

const noop = () => null;

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
            if (createMediaModal != null) {
              console.log(mimeType, item);
              const modal = createMediaModal(
                {
                  contentType: item.contentType,
                  proxyUrl: item.originalItem.proxy_url,
                  url: item.originalItem.proxy_url,
                  width: item.originalItem.width,
                  height: item.originalItem.height
                },
                noop,
                true,
                false
              );
              if (modal != null)
                openModal((modalProps: any) => {
                  return (
                    <ModalRoot {...modalProps} className={MediaModalClasses.modal} size={ModalSize.DYNAMIC}>
                      {modal.component}
                    </ModalRoot>
                  );
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

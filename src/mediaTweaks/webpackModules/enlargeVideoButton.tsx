import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { Clickable, Tooltip, MaximizeIcon, openModal, ModalRoot, ModalSize } = Components;

const HoverButtonClasses = spacepack.findByExports("hoverButton")[0].exports;

type HoverButtonsProps = {
  mimeType: string[];
  item: Record<string, any>;
};

const createMediaModal = spacepack.findFunctionByStrings(
  spacepack.findByCode(".zoomedCarouselModalRoot,items:")[0].exports,
  '.searchParams.append("format","webp")'
);

const MediaModalClasses = spacepack.findByExports("modal", "image")[0].exports;

const noop = () => null;

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
            if (createMediaModal != null)
              openModal((modalProps: any) => {
                const { component: MediaModal } = createMediaModal(
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

                return (
                  <ModalRoot {...modalProps} className={MediaModalClasses.modal} size={ModalSize.DYNAMIC}>
                    {MediaModal}
                  </ModalRoot>
                );
              });
          }}
        >
          <MaximizeIcon size="custom" color="currentColor" width={20} height={20} />
        </Clickable>
      )}
    </Tooltip>
  );
}

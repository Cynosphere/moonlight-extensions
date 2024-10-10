import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { Clickable, Tooltip, MaximizeIcon, openModal, ModalRoot } = Components;

const HoverButtonClasses = spacepack.findByExports("hoverButton")[0].exports;

type HoverButtonsProps = {
  mimeType: string[];
  item: Record<string, any>;
};

// FIXME: will break when IMGXIS gets made, needs remap
const VideoModal = spacepack.findFunctionByStrings(
  spacepack.findByCode(".Messages.OPEN_IN_BROWSER")[0].exports,
  ".videoWrapper"
);

const noop = () => null;

export default function EnlargeVideoButton({
  mimeType,
  item
}: HoverButtonsProps) {
  return mimeType?.[0] !== "video" ? null : (
    <Tooltip text="Enlarge Video">
      {(tooltipProps: any) => (
        <Clickable
          {...tooltipProps}
          className={HoverButtonClasses.hoverButton}
          focusProps={{ offset: 2 }}
          aria-label="Enlarge Video"
          onClick={() => {
            if (VideoModal != null)
              openModal((modalProps: any) => {
                return (
                  <ModalRoot {...modalProps} size="dynamic">
                    {/* @ts-expect-error cope */}
                    <VideoModal
                      width={item.originalItem.width}
                      height={item.originalItem.height}
                      poster={item.originalItem.proxy_url + "&format=webp"}
                      naturalWidth={item.originalItem.width}
                      naturalHeight={item.originalItem.height}
                      renderLinkComponent={noop}
                      renderForwardComponent={noop}
                      src={item.originalItem.proxy_url}
                      shouldHideMediaOptions={false}
                      obscure={false}
                    />
                  </ModalRoot>
                );
              });
          }}
        >
          <MaximizeIcon
            size="custom"
            color="currentColor"
            width={20}
            height={20}
          />
        </Clickable>
      )}
    </Tooltip>
  );
}

import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const MetadataClasses = spacepack.findByCode('"metadataDownload_')[0].exports;
const metadataContent = spacepack.findObjectFromValueSubstring(MetadataClasses, "metadataContent_");
const metadataSize = spacepack.findObjectFromValueSubstring(MetadataClasses, "metadataSize_");

type MetadataProps = {
  fileName: string | null;
  fileSize: string;
};

export default function VideoMetadata({ fileName, fileSize }: MetadataProps) {
  return fileName == null ? null : (
    <div className="mediaTweaks-metadata">
      <div className={metadataContent}>
        {fileName}
        <div className={metadataSize}>{fileSize}</div>
      </div>
    </div>
  );
}

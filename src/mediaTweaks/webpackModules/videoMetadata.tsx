import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const MetadataClasses = spacepack.findByExports("metadataDownload")[0].exports;

type MetadataProps = {
  fileName: string | null;
  fileSize: string;
};

export default function VideoMetadata({ fileName, fileSize }: MetadataProps) {
  return fileName == null ? null : (
    <div className="mediaTweaks-metadata">
      <div className={MetadataClasses.metadataContent}>
        {fileName}
        <div className={MetadataClasses.metadataSize}>{fileSize}</div>
      </div>
    </div>
  );
}

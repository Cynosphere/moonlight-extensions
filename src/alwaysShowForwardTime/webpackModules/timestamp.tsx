import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";

// TODO: mappings
const DateUtils = spacepack.findByCode('("DateUtils")')[0].exports;
const calendarFormatCompact = spacepack.findFunctionByStrings(DateUtils, '.calendar("lastDay",');

export default function ForwardTimestamp({
  wrapperClass,
  className,
  timestamp
}: {
  wrapperClass: string;
  className: string;
  timestamp: Date;
}) {
  return (
    <div className={wrapperClass} style={{ cursor: "default" }}>
      <Text className={className} variant="text-sm/medium" color="none">
        {calendarFormatCompact!(timestamp)}
      </Text>
    </div>
  );
}

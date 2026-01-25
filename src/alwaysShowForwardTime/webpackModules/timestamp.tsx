import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";

// TODO: mappings
const DateUtils = spacepack.findByCode('("DateUtils")')[0].exports;
const calendarFormatCompact = spacepack.findFunctionByStrings(DateUtils, '.calendar("lastDay",');

export default function ForwardTimestamp({ classes, timestamp }: { classes: Record<string, string>; timestamp: Date }) {
  const wrapperClass = React.useMemo(
    () => spacepack.findObjectFromValueSubstring(classes, "footerContainer_"),
    [classes]
  );
  const textClass = React.useMemo(() => spacepack.findObjectFromValueSubstring(classes, "footerText_"), [classes]);
  const formattedTime = React.useMemo(() => calendarFormatCompact!(timestamp), [timestamp]);

  return (
    <div className={wrapperClass} style={{ cursor: "default" }}>
      <Text className={textClass} variant="text-sm/medium" color="none">
        {formattedTime}
      </Text>
    </div>
  );
}

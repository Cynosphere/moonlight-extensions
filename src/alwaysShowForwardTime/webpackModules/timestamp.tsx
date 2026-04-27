import Text from "@moonlight-mod/wp/discord/design/components/Text/Text";
import { calendarFormatCompact } from "@moonlight-mod/wp/discord/utils/DateUtils";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

export default function ForwardTimestamp({ classes, timestamp }: { classes: Record<string, string>; timestamp: Date }) {
  const wrapperClass = React.useMemo(
    () => spacepack.findObjectFromValueSubstring(classes, "footerContainer_"),
    [classes]
  );
  const textClass = React.useMemo(() => spacepack.findObjectFromValueSubstring(classes, "footerText_"), [classes]);
  const formattedTime = React.useMemo(() => calendarFormatCompact?.(timestamp) ?? "", [timestamp]);

  return (
    <div className={wrapperClass} style={{ cursor: "default" }}>
      <Text className={textClass} variant="text-sm/medium" color="none">
        {formattedTime}
      </Text>
    </div>
  );
}

import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import DMList from "@moonlight-mod/wp/componentEditor_dmList";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";

const getTimestampString = spacepack.findByCode('["XIGt+f"]')[0].exports;
const getAbbreviatedFormatter = spacepack.findFunctionByStrings(getTimestampString, '["XIGt+f"]');
const SnowflakeUtils = spacepack.require("discord/utils/SnowflakeUtils").default;

function DMDate({ channel }: { channel: any }) {
  const lastMessage = SnowflakeUtils.extractTimestamp(channel.lastMessageId ?? channel.id);
  const formattedTime = getTimestampString.ZP({ since: lastMessage, getFormatter: getAbbreviatedFormatter });

  return (
    <Text variant="text-xxs/normal" color="currentColor" className="dmDates-date">
      {formattedTime}
    </Text>
  );
}

DMList.addItem("dmDates", DMDate, "close-button", true);

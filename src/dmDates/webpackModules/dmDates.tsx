import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import DMList from "@moonlight-mod/wp/componentEditor_dmList";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { ReadStateStore } from "@moonlight-mod/wp/common_stores";

const getTimestampString = spacepack.findByCode('["XIGt+W"]')[0].exports;
const getAbbreviatedFormatter = spacepack.findFunctionByStrings(getTimestampString, '["XIGt+W"]');
const { extractTimestamp } = spacepack.require("discord/utils/SnowflakeUtils").default;

function DMDate({ channel }: { channel: any }) {
  const lastMessage = useStateFromStores(
    [ReadStateStore],
    () => ReadStateStore.lastMessageTimestamp(channel.id) || extractTimestamp(channel.id)
  );
  const formattedTime = getTimestampString.Ay({ since: lastMessage, getFormatter: getAbbreviatedFormatter });

  return (
    <Text variant="text-xxs/normal" color="currentColor" className="dmDates-date">
      {formattedTime}
    </Text>
  );
}

DMList.addItem("dmDates", DMDate, "close-button", true);

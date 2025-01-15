import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { UserGuildSettingsStore } from "@moonlight-mod/wp/common_stores";

const DMList = spacepack.require("componentEditor_dmList").default;
const { StarIcon } = spacepack.require("discord/components/common/index");

function FavoritedIcon(props: any) {
  const id = props.channel.id;
  const override = UserGuildSettingsStore.getChannelOverrides("null")[id] ?? {};
  const isFavorite = (override.flags & 2048) !== 0;

  return isFavorite ? <StarIcon color="currentColor" size="xxs" style={{ marginRight: "8px" }} /> : null;
}

DMList.addItem("dmFavorites", FavoritedIcon, "close-button", true);

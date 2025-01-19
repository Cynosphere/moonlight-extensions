import React from "@moonlight-mod/wp/react";
import { UserGuildSettingsStore } from "@moonlight-mod/wp/common_stores";
import DMList from "@moonlight-mod/wp/componentEditor_dmList";
import { StarIcon } from "@moonlight-mod/wp/discord/components/common/index";

function FavoritedIcon(props: any) {
  const id = props.channel.id;
  const override = UserGuildSettingsStore.getChannelOverrides("null")[id] ?? {};
  const isFavorite = (override.flags & 2048) !== 0;

  return isFavorite ? <StarIcon color="currentColor" size="xxs" className="dmFavorites-icon" /> : null;
}

DMList.addItem("dmFavorites", FavoritedIcon, "close-button", true);

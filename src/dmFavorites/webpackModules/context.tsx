import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { addItem, MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import { UserGuildSettingsStore } from "@moonlight-mod/wp/common_stores";

const i18n = spacepack.findByCode("intl:")[0].exports;
const { updateChannelOverrideSettings } = spacepack.findByCode(
  '.dispatch({type:"USER_GUILD_SETTINGS_CHANNEL_UPDATE_BULK",'
)[0].exports.Z;

function FavoriteDM(props: any) {
  const id = props.channel.id;
  const override = UserGuildSettingsStore.getChannelOverrides("null")[id] ?? {};
  const isFavorite = (override.flags & 2048) !== 0;
  const langKey = isFavorite ? "z7I3gY" : "N2c/Ul";

  return (
    <MenuItem
      id="dmFavorites"
      label={i18n.intl.string(i18n.t[langKey])}
      action={() => {
        if (isFavorite) {
          override.flags &= ~2048;
        } else {
          override.flags |= 2048;
        }

        updateChannelOverrideSettings("@me", id, override);
      }}
    />
  );
}
addItem("user-context", FavoriteDM, "close-dm", true);
addItem("gdm-context", FavoriteDM, "leave-channel", true);

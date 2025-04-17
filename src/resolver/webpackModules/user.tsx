import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { addItem, MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import { ToastType, createToast, showToast } from "@moonlight-mod/wp/discord/components/common/index";

const { getUser } = spacepack.require("discord/actions/UserActionCreators");
const { openUserProfileModal } = spacepack.require("discord/actions/UserProfileModalActionCreators");

const logger = moonlight.getLogger("Resolver");

addItem(
  "unknown-user-context",
  ({ userId }: { userId: string }) => {
    return (
      <MenuItem
        id="resolve-user"
        label="Resolve User"
        action={async () => {
          try {
            const user = await getUser(userId);
            showToast(createToast(`Resolved user "${user.username}"`, ToastType.SUCCESS));
          } catch (err) {
            logger.error(`Failed to resolve user "${userId}":`, err);
            showToast(createToast("Failed to resolve user", ToastType.FAILURE));
          }
        }}
      >
        <MenuItem
          id="resolve-with-profile"
          label="and Open Profile"
          action={async () => {
            try {
              await getUser(userId).then(() => openUserProfileModal({ userId }));
            } catch (err) {
              logger.error(`Failed to resolve user "${userId}":`, err);
              showToast(createToast("Failed to resolve user", ToastType.FAILURE));
            }
          }}
        />
      </MenuItem>
    );
  },
  /^devmode-copy-id-/,
  true
);

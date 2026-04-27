import { addItem, MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import { createToast } from "@moonlight-mod/wp/discord/design/components/Toast/web/Toast";
import { showToast } from "@moonlight-mod/wp/discord/design/components/Toast/web/ToastAPI";
import { ToastType } from "@moonlight-mod/wp/discord/design/components/Toast/web/ToastConstants";
import React from "@moonlight-mod/wp/react";
import { getUser } from "@moonlight-mod/wp/discord/actions/UserActionCreators";
import { openUserProfileModal } from "@moonlight-mod/wp/discord/actions/UserProfileModalActionCreators";

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

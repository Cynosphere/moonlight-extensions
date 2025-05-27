import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { UserStore, ChannelStore } from "@moonlight-mod/wp/common_stores";

const { startEditMessage } = spacepack.findByCode("startEditMessage(", "trackInvite:")[0].exports.Z;
const canReplyToMessage = spacepack.findFunctionByStrings(
  spacepack.findByCode(".REPLYABLE.has(")[0].exports,
  ".getCurrentUser()"
);
const replyToMessage = spacepack.findFunctionByStrings(
  spacepack.findByCode(`${',source:"message-actions"}'}`)[0].exports,
  ".TEXTAREA_FOCUS)"
);
const canEditMessage = spacepack.findByCode(".IS_VOICE_MESSAGE)||")[0].exports.Z;

type EditData = {
  messageId?: string;
};

let isEditing = false,
  editData: EditData = {};

Dispatcher.subscribe("MESSAGE_START_EDIT", (event) => {
  isEditing = true;
  editData = event;
});
Dispatcher.subscribe("MESSAGE_END_EDIT", (event) => {
  isEditing = false;
  editData = {};
});

export default function onDoubleClick({ message }: { message: any }, event: MouseEvent) {
  const allowEdit = moonlight.getConfigOption<boolean>("doubleClickActions", "allowEdit") ?? true;
  const allowReply = moonlight.getConfigOption<boolean>("doubleClickActions", "allowReply") ?? true;
  const swapSelf = moonlight.getConfigOption<boolean>("doubleClickActions", "swapSelf") ?? false;

  const self = UserStore.getCurrentUser();
  const channel = ChannelStore.getChannel(message.channel_id);

  let reply = false;
  let edit = false;

  if (message.author.id === self.id) {
    if (event.shiftKey) {
      if (swapSelf && allowEdit) {
        edit = true;
      } else if (allowReply) {
        reply = true;
      }
    } else if (!event.shiftKey) {
      if (swapSelf && allowReply) {
        reply = true;
      } else if (allowEdit) {
        edit = true;
      }
    }
  } else if (allowReply) {
    reply = true;
  }

  if (reply === true) {
    if (canReplyToMessage!(channel, message)) {
      replyToMessage!(channel, message, event);
    }
  } else if (edit === true) {
    if (canEditMessage(message, self.id) && (isEditing === false || (isEditing && editData.messageId !== message.id))) {
      startEditMessage(message.channel_id, message.id, message.content);
    }
  }
}

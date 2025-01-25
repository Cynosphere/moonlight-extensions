import React from "@moonlight-mod/wp/react";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { ChannelTypes, Routes } from "@moonlight-mod/wp/discord/Constants";
import {
  Text,
  Clickable,
  showToast,
  createToast,
  popToast,
  ToastType
} from "@moonlight-mod/wp/discord/components/common/index";

import {
  ChannelStore,
  UserStore,
  GuildStore,
  ReferencedMessageStore,
  SelectedChannelStore
} from "@moonlight-mod/wp/common_stores";

const AvatarUtils = spacepack.require("discord/utils/AvatarUtils").default;

const Message = spacepack.findByCode(',role:"article",children:[')[0].exports.Z;
const MessageContent = spacepack.findByCode(".hasFlag(", "SOURCE_MESSAGE_DELETED")[0].exports.ZP;

const MessageConstructor = spacepack.findByCode('.set("roleSubscriptionData",')[0].exports;
const createMessageRecord = spacepack.findFunctionByStrings(MessageConstructor, ".createFromServer(");

const MemoizeMessage = spacepack.findByCode(".customRenderedContent:")[0].exports.Z;

const isMessageNewerThanImprovedMarkdownEpoch = Object.values(
  spacepack.findByCode('"1088216706570268682"')[0].exports
)[0] as (id: string) => boolean;

const createMessageHeader = spacepack.findByCode(".isInteractionPlaceholder(),")[0].exports.ZP;
const getMessageAuthor = spacepack.findByCode('"Result cannot be null because the message is not null"')[0].exports.ZP;

const isSystemMessage = spacepack.findByCode(".USER_MESSAGE.has")[0].exports.Z;

const jumpToMessage = spacepack.findByCode('kind:"channel"', ".CHANNEL_THREAD_VIEW(")[0].exports.Z;

type MakeTextChatNotification = (
  message: any,
  channelId: string,
  suppressRoles?: boolean,
  ignoreStatus?: boolean
) => { body: string };
type ShouldNotify = (
  message: any,
  user: any,
  channel: any,
  options?: { ignoreSameUser: boolean; ingoreStatus: boolean; ignoreNoMessagesSetting: boolean }
) => boolean;
type _MemoizeReferencedMessage = (
  message: any,
  channel: any,
  messageReference: any,
  referencedMessage: any,
  compat: boolean
) => React.ComponentType<any>;
type UseRoleIcon = (props: { guildId?: string; roleId: string }, subscription?: string) => React.ReactElement;

let makeTextChatNotification: MakeTextChatNotification,
  shouldNotify: ShouldNotify,
  useRoleIcon: UseRoleIcon,
  MemoizeReferencedMessage: _MemoizeReferencedMessage,
  SystemMessage: React.ComponentType<any>,
  EmbedClasses: Record<string, string>;

function lazyLoad() {
  if (!makeTextChatNotification) {
    const NotificationTextUtils = spacepack.findByCode('"NotificationTextUtils"')[0].exports;
    makeTextChatNotification = spacepack.findFunctionByStrings(
      NotificationTextUtils,
      '"failed to stringify system message"'
    ) as MakeTextChatNotification;
    shouldNotify = spacepack.findFunctionByStrings(
      NotificationTextUtils,
      ".SUPPRESS_NOTIFICATIONS))return!1"
    ) as ShouldNotify;

    useRoleIcon = spacepack.findFunctionByStrings(
      spacepack.findByCode(',"roleIcon",')[0].exports,
      ',"roleIcon",'
    ) as UseRoleIcon;

    MemoizeReferencedMessage = spacepack.findByCode("isReplyAuthorBlocked:", ".REPLY||null==")[0].exports.Z;

    SystemMessage = spacepack.findByCode('("SystemMessage")')[0].exports.Z;

    EmbedClasses = spacepack.findByCode("embedAuthorIcon:")[0].exports;
  }
}

// this is like near impossible to import nicely
function createSystemMessage({ message, channel, compact }: { message: any; channel: any; compact: boolean }) {
  return isSystemMessage(message) ? <SystemMessage message={message} channel={channel} compact={compact} /> : null;
}

function InAppNotification({ message, channel, author }: { message: any; channel: any; author: any }) {
  const notifText = makeTextChatNotification(channel, message, author).body;
  const newMessage = createMessageRecord!(
    message.content === "" ? Object.assign({}, message, { content: notifText }) : message
  );
  const guild = GuildStore.getGuild(channel.getGuildId());

  const useExtendedMarkdown = isMessageNewerThanImprovedMarkdownEpoch(message.id);

  const memoizedMessage = MemoizeMessage(newMessage, {
    hideSimpleEmbedContent: false,
    formatInline: true,
    allowList: useExtendedMarkdown,
    allowHeading: useExtendedMarkdown,
    allowLinks: useExtendedMarkdown,
    previewLinkTarget: useExtendedMarkdown
  });
  const referencedMessage = useStateFromStores([ReferencedMessageStore], () =>
    ReferencedMessageStore.getMessageByReference(newMessage.messageReference)
  );
  const memoizedReferencedMessage = MemoizeReferencedMessage(
    newMessage,
    channel,
    newMessage.messageReference,
    referencedMessage,
    false
  );

  const messageAuthor = getMessageAuthor(newMessage);
  const roleIcon = useRoleIcon!({
    guildId: guild?.id,
    roleId: messageAuthor.iconRoleId
  });

  const header = createMessageHeader({
    message: newMessage,
    channel,
    author: messageAuthor,
    guildId: guild?.id,
    isGroupStart: true,
    roleIcon,
    animateAvatar: false,
    hideTimestamp: false,
    compact: false
  });
  const systemMessage = createSystemMessage({
    message: newMessage,
    channel,
    compact: false
  });

  const messageContent = React.useMemo(
    () => (
      <MessageContent message={newMessage} content={memoizedMessage.content} className="inAppNotification-content" />
    ),
    [newMessage, memoizedMessage]
  );

  const guildIcon = guild
    ? AvatarUtils.getGuildIconURL({
        id: guild.id,
        icon: guild.icon,
        size: 24
      })
    : null;
  const dmIcon =
    channel.type === ChannelTypes.GROUP_DM
      ? AvatarUtils.getChannelIconURL({
          id: channel.id,
          icon: channel.icon,
          size: 24
        })
      : null;

  const jump = React.useCallback(() => {
    jumpToMessage(Routes.CHANNEL(guild ? guild.id : "@me", channel.id, newMessage.id));
    popToast();
  }, [newMessage, channel, guild]);

  return (
    <Clickable
      className="inAppNotification-card"
      onClick={jump}
      // @ts-expect-error fix type
      onContextMenu={() => popToast()}
    >
      {guild != null || channel.type === ChannelTypes.GROUP_DM ? (
        <div className="inAppNotification-nameContainer">
          {guildIcon || dmIcon ? <img className={EmbedClasses.embedAuthorIcon} src={guildIcon ?? dmIcon} /> : null}

          <Text variant="text-md/bold" tag="span" color="text-muted">
            {guild
              ? `${guild.name} - #${channel.name}`
              : channel.name === ""
                ? channel.rawRecipients.map((user: any) => user.global_name ?? user.username).join(", ")
                : channel.name}
          </Text>
        </div>
      ) : null}
      <Message
        compact={false}
        contentOnly={false}
        disableInteraction={true}
        childrenMessageContent={messageContent}
        childrenRepliedMessage={memoizedReferencedMessage}
        childrenHeader={header}
        childrenSystemMessage={systemMessage}
        hasReply={newMessage.messageReference != null}
      />
      <div className="inAppNotification-timer" />
    </Clickable>
  );
}

const logger = moonlight.getLogger("In App Notifications");
Dispatcher.subscribe("MESSAGE_CREATE", (event: any) => {
  try {
    lazyLoad();
    if (event.optimistic) return;
    const { channelId, message } = event;

    const channel = ChannelStore.getChannel(channelId);
    const author = UserStore.getUser(message.author.id);
    if (!channel || !author) return;

    const notify = shouldNotify(message, channelId, false);

    if (!notify) return;
    if (channelId === SelectedChannelStore.getChannelId()) return;

    if (moonlight.getConfigOption<boolean>("inAppNotifications", "replace") ?? false) popToast();

    showToast(
      createToast(null, ToastType.CUSTOM, {
        duration: 10000,
        component: <InAppNotification message={message} channel={channel} author={author} />
      })
    );
  } catch (err) {
    logger.error("Failed to do things:", err);
  }
});

import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Tooltip } from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { ApplicationStore, GameStore, UserStore } from "@moonlight-mod/wp/common_stores";

// FIXME: mappings
const { ActivityTypes, PlatformTypes } = spacepack.require("discord/Constants");

const useUserProfileActivity = spacepack.findByCode(`${'("use-user-profile-activity")'}`)[0].exports.Z;
const ConnectionPlatforms = spacepack.findByCode("getByUrl(", "get(", `${"isSupported:"}`)[0].exports.Z;
const UserProfileActivityCard = spacepack.findByCode(`${'location:"UserProfileActivityCard",'}`)[0].exports.Z;

const ActivityClasses = spacepack.findByCode(
  "applicationStreamingPreviewWrapper:" + '"applicationStreamingPreviewWrapper_'
)[0].exports;

const SpotifyIcon = ConnectionPlatforms.get(PlatformTypes.SPOTIFY).icon.lightSVG;
const TwitchIcon = ConnectionPlatforms.get(PlatformTypes.TWITCH).icon.lightSVG;

type ActivityIconsProps = {
  user: any;
};
type ActivityIconProps = {
  user: any;
  currentUser: any;
  activity: any;
};
type ActivityIconIconProps = {
  card: React.ReactNode;
  icon: string;
};

function ActivityIconIcon({ card, icon }: ActivityIconIconProps) {
  return (
    <Tooltip text={card} position="left" tooltipClassName="allActivities-iconTooltip">
      {(tooltipProps: any) => <img {...tooltipProps} className={ActivityClasses.headerIcon} src={icon} />}
    </Tooltip>
  );
}

function ActivityIcon({ user, currentUser, activity }: ActivityIconProps) {
  const game = useStateFromStores([GameStore, ApplicationStore], () => {
    return activity != null && activity.application_id
      ? ApplicationStore.getApplication(activity.application_id)
      : activity.title && GameStore.getGameByName(activity.title);
  });

  const gameIcon = React.useMemo(() => game?.getIconURL(24), [game]);

  const card = React.useMemo(
    () => (
      <UserProfileActivityCard
        user={user}
        currentUser={currentUser}
        activity={activity}
        className="allActivities-iconCard"
      />
    ),
    [user, currentUser, activity, UserProfileActivityCard]
  );

  if (activity.name === "Spotify") {
    return <ActivityIconIcon card={card} icon={SpotifyIcon} />;
  } else if (activity.type === ActivityTypes.STREAMING) {
    return <ActivityIconIcon card={card} icon={TwitchIcon} />;
  } else if (activity.application_id && activity?.assets?.large_image) {
    const icon = activity.assets.large_image.startsWith("mp:")
      ? activity.assets.large_image.replace("mp:", "https://media.discordapp.net/") + "?width=24&height=24"
      : activity.assets.large_image.startsWith("spotify:")
        ? activity.assets.large_image.replace("spotify:", "https://i.scdn.co/image/")
        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png?size=24`;
    return <ActivityIconIcon card={card} icon={icon} />;
  } else if (game && gameIcon) {
    return <ActivityIconIcon card={card} icon={gameIcon} />;
  }

  return null;
}

export default function ActivityIcons({ user }: ActivityIconsProps) {
  const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());
  const { live } = useUserProfileActivity(user.id);

  return (
    <div className="allActivities-icons">
      {live.map((activity: any) => (
        <ActivityIcon user={user} currentUser={currentUser} activity={activity} />
      ))}
    </div>
  );
}

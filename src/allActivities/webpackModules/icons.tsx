import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Tooltip } from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { ApplicationStore, GameStore, UserStore } from "@moonlight-mod/wp/common_stores";
import MemberList from "@moonlight-mod/wp/componentEditor_memberList";
import { ActivityTypes, PlatformTypes } from "@moonlight-mod/wp/discord/Constants";

const useUserProfileActivity = spacepack.findByCode(`location:${JSON.stringify("useUserProfileActivity")}`)[0].exports
  .A;
const ConnectionPlatforms = spacepack.findByCode("getByUrl(", "get:", "isSupported:")[0].exports.A;
const UserProfileActivityCard = spacepack.findByCode(`location:${JSON.stringify("UserProfileActivityCard")},`)[0]
  .exports.A;

const ActivityClasses = spacepack.findByCode('"applicationStreamingPreviewWrapper_')[0].exports;

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
  subicon?: string | null;
};

function ActivityIconIcon({ card, icon, subicon = null }: ActivityIconIconProps) {
  return (
    <Tooltip text={card} position="left" tooltipClassName="allActivities-iconTooltip">
      {(tooltipProps: any) => (
        <div {...tooltipProps} className="allActivities-icon">
          <img className={spacepack.findObjectFromValueSubstring(ActivityClasses, "headerIcon_")} src={icon} />
          {subicon != null ? <img className="allActivities-subicon" src={subicon} /> : null}
        </div>
      )}
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
    const albumArt = activity.assets?.large_image?.replace("spotify:", "https://i.scdn.co/image/");
    return (
      <ActivityIconIcon card={card} icon={albumArt ?? SpotifyIcon} subicon={albumArt != null ? SpotifyIcon : null} />
    );
  } else if (activity.type === ActivityTypes.STREAMING) {
    return <ActivityIconIcon card={card} icon={TwitchIcon} />;
  } else if (activity.application_id && activity?.assets?.large_image) {
    const icon = activity.assets.large_image.startsWith("mp:")
      ? activity.assets.large_image.replace("mp:", "https://media.discordapp.net/") + "?width=128&height=128"
      : activity.assets.large_image.startsWith("spotify:")
        ? activity.assets.large_image.replace("spotify:", "https://i.scdn.co/image/")
        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png?size=128`;
    return <ActivityIconIcon card={card} icon={icon} />;
  } else if (game && gameIcon) {
    return <ActivityIconIcon card={card} icon={gameIcon} />;
  }

  return null;
}

function ActivityIcons({ user }: ActivityIconsProps) {
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

MemberList.addItem("activityIcons", ActivityIcons);

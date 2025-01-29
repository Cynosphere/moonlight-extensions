import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const UserProfileActivityCardWrapper = spacepack.findByCode(
  `location:${JSON.stringify("UserProfileActivityCardWrapper")}`
)[0].exports.Z;
const UserProfileStreamActivityCard = spacepack.findByCode(
  `surface:${JSON.stringify("user-profile-stream-activity-card")},`
)[0].exports.Z;
const useUserProfileActivity = spacepack.findByCode(`${JSON.stringify("use-user-profile-activity")}`)[0].exports.Z;
const useUserActivityFeedRecent = spacepack.findByCode(
  '"application_id"in',
  ".extra.application_id",
  ".GAME_PROFILE_FEED"
)[0].exports.Z;
const ActivityFeedTimeUtils = spacepack.findByCode(".TRENDING_CONTENT))||void 0===")[0].exports;
const ActivityFeed48h = spacepack.findFunctionByStrings(ActivityFeedTimeUtils, ".Millis.HOUR<48");
const UserProfileRecentActivityCard = spacepack.findByCode("{recentActivityEnabled:", ".bot?(0,")[0].exports.Z;

type UserPopoutActivitiesProps = {
  user: any; // no discord common types :(
  currentUser: any;
  profileGuildId: string;
  className: string;
  onClose: () => void;
};

const LOCATION = "UserProfileFeaturedActivity";

export default function UserPopoutActivities({
  user,
  currentUser,
  profileGuildId,
  className,
  onClose
}: UserPopoutActivitiesProps) {
  const { live, recent, stream } = useUserProfileActivity(user.id);
  const [firstActivity] = live;

  const isCurrentUser = user.id === currentUser.id;

  const recentFeedEntry = useUserActivityFeedRecent(user.id, LOCATION);
  const feedEntry = React.useMemo(
    () => (isCurrentUser ? recent.find(ActivityFeed48h) : recentFeedEntry),
    [isCurrentUser, recent, recentFeedEntry]
  );

  const activities = [...live];
  activities.shift();

  return [
    null != stream ? (
      <UserProfileStreamActivityCard
        location={LOCATION}
        user={user}
        currentUser={currentUser}
        stream={stream}
        profileGuildId={profileGuildId}
        className={className}
        onClose={onClose}
      />
    ) : null != firstActivity ? (
      <UserProfileActivityCardWrapper
        location={LOCATION}
        user={user}
        currentUser={currentUser}
        activity={firstActivity}
        profileGuildId={profileGuildId}
        className={className}
        onClose={onClose}
      />
    ) : feedEntry != null ? (
      <UserProfileRecentActivityCard
        location={LOCATION}
        user={user}
        currentUser={currentUser}
        entry={feedEntry}
        profileGuildId={profileGuildId}
        className={className}
        onClose={onClose}
      />
    ) : null,
    ...activities.map((activity: any) => (
      <UserProfileActivityCardWrapper
        location={LOCATION}
        user={user}
        currentUser={currentUser}
        activity={activity}
        profileGuildId={profileGuildId}
        className={className}
        onClose={onClose}
      />
    ))
  ];
}

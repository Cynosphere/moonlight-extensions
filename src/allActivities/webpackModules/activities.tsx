import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const UserProfileActivityCardWrapper = spacepack.findByCode(
  `location:${JSON.stringify("UserProfileActivityCardWrapper")}`
)[0].exports.Z;
const UserProfileStreamActivityCard = spacepack.findByCode(
  `surface:${JSON.stringify("user-profile-stream-activity-card")},`
)[0].exports.Z;
const useUserProfileActivity = spacepack.findByCode(`location:${JSON.stringify("useUserProfileActivity")}`)[0].exports
  .Z;

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
  const { live, stream } = useUserProfileActivity(user.id);
  const [firstActivity] = live;

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

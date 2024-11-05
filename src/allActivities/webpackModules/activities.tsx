import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const UserProfileActivityCardWrapper = spacepack.findByCode('location:"' + 'UserProfileActivityCardWrapper"')[0].exports
  .Z;
const UserProfileStreamActivityCard = spacepack.findByCode('surface:"' + 'user-profile-stream-activity-card",')[0]
  .exports.Z;
const useUserProfileActivity = spacepack.findByCode('("use-user-' + 'profile-activity")')[0].exports.Z;

type UserPopoutActivitiesProps = {
  user: any; // no discord common types :(
  currentUser: any;
  className: string;
  onClose: () => void;
};

export default function UserPopoutActivities({ user, currentUser, className, onClose }: UserPopoutActivitiesProps) {
  const { live, stream } = useUserProfileActivity(user.id);
  const [firstActivity] = live;
  const activities = [...live];
  activities.shift();

  return [
    null != stream ? (
      <UserProfileStreamActivityCard
        user={user}
        currentUser={currentUser}
        stream={stream}
        className={className}
        onClose={onClose}
      />
    ) : null != firstActivity ? (
      <UserProfileActivityCardWrapper
        user={user}
        currentUser={currentUser}
        activity={firstActivity}
        className={className}
        onClose={onClose}
      />
    ) : null,
    ...activities.map((activity: any) => (
      <UserProfileActivityCardWrapper
        user={user}
        currentUser={currentUser}
        activity={activity}
        className={className}
        onClose={onClose}
      />
    ))
  ];
}

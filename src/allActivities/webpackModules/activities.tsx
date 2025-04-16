import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const UserProfileActivityCardWrapper = spacepack.findByCode(
  `location:${JSON.stringify("UserProfileActivityCardWrapper")}`
)[0].exports.Z;
const useUserProfileActivity = spacepack.findByCode(`location:${JSON.stringify("useUserProfileActivity")}`)[0].exports
  .Z;

type UserPopoutActivitiesProps = {
  user: any; // no discord common types :(
  currentUser: any;
  displayProfile?: {
    guildId: string;
  };
  guildId?: string;
  className: string;
  onClose: () => void;
};

const LOCATION = "UserProfileFeaturedActivity";

export default function UserPopoutActivities(
  props: UserPopoutActivitiesProps,
  UserProfileFeaturedActivity: (props: UserPopoutActivitiesProps) => React.ReactNode
) {
  const { user, currentUser, displayProfile, guildId, className, onClose } = props;
  const { live } = useUserProfileActivity(user.id);

  const activities = [...live];
  activities.shift();

  return [
    <UserProfileFeaturedActivity {...props} />,
    ...activities.map((activity: any) => (
      <UserProfileActivityCardWrapper
        location={LOCATION}
        user={user}
        currentUser={currentUser}
        activity={activity}
        profileGuildId={displayProfile?.guildId ?? guildId}
        className={className}
        onClose={onClose}
      />
    ))
  ];
}

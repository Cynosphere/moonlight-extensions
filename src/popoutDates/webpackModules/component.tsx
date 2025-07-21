import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";

const MemberSince = spacepack.findByCode(`.member${""}Since,`)[0]?.exports?.Z;

export default function PopoutDates({ userId, guildId }: { userId: string; guildId?: string }) {
  return (
    <ErrorBoundary noop={true}>
      <MemberSince userId={userId} guildId={guildId} />
    </ErrorBoundary>
  );
}

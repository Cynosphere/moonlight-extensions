import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import {
  GameStore,
  RunningGameStore,
  LibraryApplicationStore,
  SelfPresenceStore,
  ApplicationStore
} from "@moonlight-mod/wp/common_stores";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const modRunningGameStore = spacepack.findByCode(`displayName=${JSON.stringify("RunningGameStore")}`)[0].exports;
const extendGameEntry = spacepack.findFunctionByStrings(modRunningGameStore, ':" ",overlay:');

const logger = moonlight.getLogger("Rich Presence Obeys Game Detection");

Dispatcher.addInterceptor((event) => {
  try {
    if (event.type !== "LOCAL_ACTIVITY_UPDATE") return false;
    if (event.activity?.application_id == null) return false;

    const app = ApplicationStore.getApplication(event.activity.application_id);
    const linked = (app?.linkedGames ?? []).map((a: any) => a.id);
    const game = RunningGameStore.getRunningGames().find(
      (g: any) => g.id === event.activity.application_id || linked.includes(g.id)
    );
    if (game != null) {
      const extended = extendGameEntry!(game, RunningGameStore, GameStore, LibraryApplicationStore);
      if (!extended.detectable) {
        const act = SelfPresenceStore.getActivities().find(
          (a: any) => a.application_id === event.activity.application_id
        );
        // this is only to fight a discord startup race condition grrr
        if (act) {
          setTimeout(() => {
            Dispatcher.dispatch({
              type: "LOCAL_ACTIVITY_UPDATE",
              socketId: event.socketId,
              pid: event.pid
            });
          }, 0);
        }
        return true;
      }
    }

    return false;
  } catch (err) {
    logger.error("Failed to intercept activity update:", err);
    return false;
  }
});

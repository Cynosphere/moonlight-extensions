import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import { PlatformStyle } from "../types";

Dispatcher.addInterceptor((data) => {
  if (data.type == "POPOUT_WINDOW_OPEN") {
    const style = moonlight.getConfigOption<PlatformStyle>("platformStyles", "style") ?? "default";

    if (style === "linux") data.features.frame = true;
  }

  return false;
});

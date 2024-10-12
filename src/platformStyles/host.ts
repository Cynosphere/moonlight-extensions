import { BrowserWindowConstructorOptions } from "electron";
import { PlatformStyle } from "./types";

moonlightHost.events.on("window-options", (options: BrowserWindowConstructorOptions) => {
  const style = moonlightHost.getConfigOption<PlatformStyle>("platformStyles", "style") ?? "default";
  const useFrame = style === "linux";

  const isPopout = options.center && options.width === 300 && options.height === 350;

  if (!isPopout) {
    if (style !== "default") {
      options.frame = useFrame;
    }
  }
});

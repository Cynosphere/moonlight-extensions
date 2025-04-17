const HANDLERS = {
  steam: {
    links: ["store.steampowered.com", "help.steampowered.com", "steamcommunity.com"],
    protocol: "steam://openurl/"
  },
  spotify: {
    links: ["open.spotify.com"],
    protocol: "spotify:"
  }
};

export default function OpenExternallyRedirect(href: string) {
  try {
    const url = new URL(href);
    for (const [name, handler] of Object.entries(HANDLERS)) {
      const enabled = moonlight.getConfigOption<boolean>("openExternally", name) ?? true;
      if (!enabled) continue;

      if (handler.links.includes(url.hostname)) {
        return function (event?: React.MouseEvent) {
          if (event != null) event.preventDefault();
          window.open(handler.protocol + href);

          return true;
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

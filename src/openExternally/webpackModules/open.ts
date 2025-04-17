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
        return handler.protocol + href;
      }
    }
  } catch {
    return href;
  }
}

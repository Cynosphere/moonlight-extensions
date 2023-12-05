# moonlight sample extension

This is a sample extension for the [moonlight](https://github.com/moonlight-mod/moonlight) Discord mod.

## Getting started

- Make sure you have [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io) installed.
- Click "Use this template".
- In the repository settings, make sure GitHub Actions are enabled for this repository, and that the GitHub Pages source is set to GitHub Actions.

Then, clone and start hacking away:

- Install dependencies (`pnpm i`).
- Build the project (`pnpm run build`).
  - If you'd prefer to run in watch mode, do `pnpm run dev` instead.

Add the following to your moonlight config:

```json
{
  "devSearchPaths": [
    "/path/to/sample-extension/dist"
  ]
}
```

where `/path/to/sample-extension` is the folder you cloned the repository into. After restarting your client, the extension will load.

## Project structure

This sample extension uses [esbuild](https://esbuild.github.io) as its build system. The two entrypoints (`index` and `node`) get loaded on the web and Node.js side respectively. Code exported from the Node.js side can be called from the web side. Each side is optional, in case you only need to run in a specific context (usually web only).

## Publishing to GitHub Pages

Your repository will be published to `https://<username>.github.io/<repository>/repo.json`. Every time a commit is made to the main branch, the extensions will be built on GitHub Actions and published automatically.

# Devpilot Webview

## Getting started

```sh
pnpm install
```

```sh
pnpm run dev
```

For building the app for editor plugin, run the following command (assuming the plugin repo is in the same directory as the devpilot-h5 repo).

```sh
pnpm run build && cp dist/index.html ../devpilot-vscode/dist/index.html
```

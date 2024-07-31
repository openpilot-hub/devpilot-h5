<div align=center>

# <img src="./src/assets/devpilot.svg" width="26"> DevPilot

"Your pair programming partner makes you a greater navigator"

[English](README.md) | [中文](README_ZH.md)

</div>

# DevPilot Webview

Welcome to the **DevPilot Webview** project! This README will guide you through the process of setting up, running, and building the webview for integration with the DevPilot editor plugin.

## Project Introduction

DevPilot Webview is a subproject of the DevPilot initiative, designed specifically to embed a Webview within IDEs like VSCode and IntelliJ. This Webview allows users to experience the rich features of DevPilot directly within their development environment, enhancing both efficiency and user experience.

## Getting Started

To get started with the project, you'll need to follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version 14 or above)
- **pnpm** (package manager)

### Installation

First, install the necessary dependencies for the project. Open your terminal and navigate to the project directory, then run:

```sh
pnpm install
```

This will install all the required packages listed in the `package.json` file.

### Running the Development Server

To start the development server, which will watch for changes and automatically reload the webview, execute the following command:

```sh
pnpm run dev
```

This command starts the development server and opens the project in your default web browser. You can now make changes to the code, and they will be reflected in real-time.

### Building the Application

When you're ready to build the application for production, especially for use as an editor plugin, use the following command:

```sh
pnpm run build
```

This command creates an optimized production build of the application in the `dist` directory.

### Integrating with the Editor Plugin

To integrate the built webview with the DevPilot editor plugin, you need to copy the built `index.html` file to the plugin's distribution directory. Assuming the plugin repository is located in the same parent directory as the `devpilot-h5` repository, run:

```sh
pnpm run build && cp dist/index.html ../devpilot-vscode/dist/index.html
```

This command first builds the project and then copies the `index.html` file to the specified location in the `devpilot-vscode` plugin repository.

### Project Structure

- **src/**: Contains the source code of the webview.
- **dist/**: The output directory for the production build.
- **public/**: Static assets for the project.
- **package.json**: Lists project dependencies and scripts.

### Troubleshooting

If you encounter any issues, consider the following steps:

1. Ensure all dependencies are installed by running `pnpm install`.
2. Check for any error messages in the terminal or browser console.
3. Verify the file paths and locations, especially when copying the `index.html` to the plugin directory.

For further assistance, you may refer to the documentation or seek help from the community.

## Build your own plugin

[DevPilot for Visual Studio Code](https://github.com/openpilot-hub/devpilot-vscode/blob/main/BUILD_PLUGIN_ZH.md)

[DevPilot for JetBrains](https://github.com/openpilot-hub/devpilot-intellij/blob/main/BUILD_PLUGIN_ZH.md)

## Contributing

[Contribute to DevPilot for Visual Studio Code](https://github.com/openpilot-hub/devpilot-vscode/blob/main/CONTRIBUTING_ZH.md)

[Contribute to DevPilot for JetBrains](https://github.com/openpilot-hub/devpilot-intellij/blob/main/CONTRIBUTING_ZH.md)

## Ping Us

Got questions or suggestions, please contact us via email at [pilot_group@zhongan.com](mailto:pilot_group@zhongan.com)
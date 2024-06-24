<div align=center>

# <img src="./src/assets/devpilot.svg" width="26"> DevPilot

"您的程序伙伴助您成为更出色的开发者"

[English](README.md) | [中文](README_ZH.md)

</div>

# Devpilot Webview

欢迎来到 **Devpilot Webview** 项目！此 README 将指导您设置、运行和构建 Webview，以便与 Devpilot 编辑器插件集成。

## 项目简介

Devpilot Webview 是 DevPilot 计划的一个子项目，专为在 VSCode 和 IntelliJ 等 IDE 中嵌入 Webview 而设计。此 Webview 允许用户直接在他们的开发环境中体验 DevPilot 的丰富功能，从而提升效率和用户体验。

## 入门指南

要开始该项目，您需要按照以下步骤操作：

### 前提条件

确保您的机器上已安装以下软件：

- **Node.js**（版本 14 或以上）
- **pnpm**（包管理工具）

### 安装

首先，安装项目所需的依赖项。打开终端并导航到项目目录，然后运行：

```sh
pnpm install
```

这将安装 `package.json` 文件中列出的所有必要包。

### 运行开发服务器

要启动开发服务器，该服务器将监视更改并自动重新加载 Webview，请执行以下命令：

```sh
pnpm run dev
```

此命令将启动开发服务器并在默认浏览器中打开项目。现在，您可以对代码进行更改，变化将实时反映。

### 构建应用

当您准备好为生产环境构建应用，特别是用作编辑器插件时，请使用以下命令：

```sh
pnpm run build
```

此命令将在 `dist` 目录中创建一个优化的生产构建版本。

### 与编辑器插件集成

要将构建的 Webview 集成到 Devpilot 编辑器插件中，您需要将构建的 `index.html` 文件复制到插件的分发目录。假设插件仓库位于与 `devpilot-h5` 仓库相同的父目录中，请运行：

```sh
pnpm run build && cp dist/index.html ../devpilot-vscode/dist/index.html
```

此命令首先构建项目，然后将 `index.html` 文件复制到 `devpilot-vscode` 插件仓库中的指定位置。

### 项目结构

- **src/**：包含 Webview 的源代码。
- **dist/**：生产构建的输出目录。
- **public/**：项目的静态资源。
- **package.json**：列出项目依赖项和脚本。

### 故障排除

如果遇到任何问题，请考虑以下步骤：

1. 通过运行 `pnpm install` 确保所有依赖项已安装。
2. 检查终端或浏览器控制台中的错误消息。
3. 验证文件路径和位置，特别是在将 `index.html` 复制到插件目录时。

如需进一步帮助，您可以参考文档或寻求社区的帮助。

## 使用文档

[DevPilot Visual Studio Code 插件使用文档](https://github.com/openpilot-hub/documentation/blob/main/README_VSCode.md)

[DevPilot JetBrains 插件使用文档](https://github.com/openpilot-hub/documentation/blob/main/README_JetBrains.md)

## RAG

[DevPilot RAG 使用说明](https://github.com/openpilot-hub/documentation/blob/main/README_RAG.md)

## 构建自己的插件

[构建 DevPilot for Visual Studio Code](https://github.com/openpilot-hub/devpilot-vscode/blob/main/BUILD_PLUGIN_ZH.md)

[构建 DevPilot for JetBrains](https://github.com/openpilot-hub/devpilot-intellij/blob/main/BUILD_PLUGIN_ZH.md)

## 贡献

更多信息请查看

[贡献 DevPilot for Visual Studio Code](https://github.com/openpilot-hub/devpilot-vscode/blob/main/CONTRIBUTING_ZH.md)

[贡献 DevPilot for JetBrains](https://github.com/openpilot-hub/devpilot-intellij/blob/main/CONTRIBUTING_ZH.md)

## 联系我们

如果有任何问题或建议,请通过电子邮件联系我们 [pilot_group@zhongan.com](mailto:pilot_group@zhongan.com)

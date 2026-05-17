<div align="center">

# BinTools

**面向实验室科研人员的桌面端生物分析可视化工具**

[![Electron](https://img.shields.io/badge/Electron-31.0.0-47848F?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.6-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 简介

BinTools 是一款**零代码、本地化运行**的桌面端生物信息分析可视化软件，专为不熟悉编程的实验室科研人员设计。无需配置环境、无需安装 R/Python，导入数据即可生成交互式、发表级质量的图表。

软件完全离线运行，**不收集任何数据与遥测信息**，保障科研数据的隐私安全。

---

## 功能模块

| 模块 | 功能描述 | 输入格式 | 核心技术 |
|:---|:---|:---|:---|
| **🎨 热图 (Heatmap)** | 上传基因表达或丰度矩阵，生成带层次聚类的发表级热图，支持 Z-score 标准化、自定义配色与标签 | Excel (.xlsx) | Plotly.js, ml-hclust |
| **🕸️ 共现网络图 (Network)** | 上传 OTU/ASV 丰度表，自动计算 Spearman 相关性，生成力导向共现网络图，支持按门着色 | Excel (.xlsx) | D3.js Force Simulation |
| **🌿 系统发育树 (Phylo)** | 上传 FASTA 序列，自动检测对齐状态，基于 Neighbor-Joining 算法构建系统发育树 | FASTA (.fasta/.fa/.fna/.faa) | D3.js, ml-hclust |

---

## 安装与运行

### 环境要求

- [Node.js](https://nodejs.org/) ≥ 18
- npm 或兼容包管理器

### 本地开发

```bash
# 1. 克隆仓库
git clone git@github.com:Hear1t/bintools.git
cd bintools

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 构建应用

```bash
# macOS (arm64 + x64, .dmg)
npm run build:mac

# Windows (x64, .exe 安装包)
npm run build:win
```

构建产物位于 `release/` 目录。

---

## 使用指南

1. **启动软件** — 打开 BinTools，在欢迎页选择需要的分析模块。
2. **导入数据** — 点击上传按钮导入 Excel 或 FASTA 文件；也可直接使用内置示例数据。
3. **预览与确认** — Excel 数据支持多 Sheet 预览和列映射，确认后进入可视化界面。
4. **调整参数** — 在左侧参数面板中实时调整颜色、标签、阈值等样式。
5. **导出图表** — 点击顶部工具栏，将图表导出为 **PDF** 或 **SVG** 格式，用于论文或报告。

---

## 技术架构

```
bintools/
├── electron/                  # Electron 主进程与预加载脚本
│   ├── main.ts                # 主进程入口
│   └── preload.ts             # 安全通信桥梁
├── src/
│   ├── components/            # React 组件
│   │   ├── WelcomeScreen.tsx  # 欢迎页与模块选择
│   │   ├── MainLayout.tsx     # 主布局框架
│   │   ├── HeatmapCanvas.tsx  # 热图画布
│   │   ├── NetworkCanvas.tsx  # 网络图画布
│   │   ├── PhyloCanvas.tsx    # 进化树画布
│   │   └── ...
│   ├── services/              # 业务逻辑服务
│   │   ├── fileLoader.ts      # 文件解析加载
│   │   ├── fastaParser.ts     # FASTA 序列解析
│   │   └── exportPdf.ts       # PDF 导出
│   ├── store/                 # Zustand 全局状态管理
│   ├── hooks/                 # 自定义 React Hooks
│   ├── data/examples/         # 内置示例数据集
│   └── types/                 # TypeScript 类型定义
├── build/                     # 构建资源
├── dist/                      # Vite 构建输出
├── dist-electron/             # Electron 构建输出
└── release/                   # 最终打包产物
```

---

## 核心依赖

| 依赖 | 用途 |
|:---|:---|
| [Electron](https://www.electronjs.org/) | 桌面应用框架 |
| [Vite](https://vitejs.dev/) | 构建工具与开发服务器 |
| [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI 框架与类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | 原子化 CSS |
| [Plotly.js](https://plotly.com/javascript/) | 热图绘制 |
| [D3.js](https://d3js.org/) | 网络图与进化树可视化 |
| [Zustand](https://github.com/pmndrs/zustand) | 轻量级状态管理 |
| [SheetJS (xlsx)](https://sheetjs.com/) | Excel 文件解析 |
| [jsPDF](https://github.com/parallax/jsPDF) + [svg2pdf.js](https://github.com/yWorks/svg2pdf.js) | PDF 导出 |

---

## 截图

> _待补充：欢迎页、热图、网络图、进化树界面截图_

---

## 开发计划

- [x] 热图模块（Z-score、层次聚类、配色方案）
- [x] 共现网络图模块（Spearman 相关、力导向布局）
- [x] 系统发育树模块（NJ 算法、自动对齐检测）
- [x] PDF / SVG 导出
- [x] 内置示例数据集
- [x] 深色 / 浅色主题切换
- [ ] 更多聚类算法支持（UPGMA、WPGMA）
- [ ] PCA / NMDS 降维可视化
- [ ] Alpha / Beta 多样性分析

---

## 贡献

欢迎 Issue 和 PR！如果你在使用过程中遇到问题，或有新功能建议，请通过 GitHub Issues 反馈。

---

## 许可

[MIT](LICENSE) © 2026 [Hear1t](https://github.com/Hear1t)

---

<div align="center">

**[ OFFLINE ] · [ NO TELEMETRY ] · [ LOCAL RUNTIME ]**

</div>

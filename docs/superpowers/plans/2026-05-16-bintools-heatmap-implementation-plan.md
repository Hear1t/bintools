# BinTools 热图 MVP · 实施计划

**关联设计文档**：[`../specs/2026-05-16-bintools-heatmap-design.md`](../specs/2026-05-16-bintools-heatmap-design.md)
**日期**：2026-05-16
**整体策略**：12 个 phase，每个 phase 独立可完成、可验收。建议一次只做一个 phase，做完验收，再开下一个。

---

## 怎么用这份文档

每个 phase 包含 5 个部分：

1. **目标**：这个 phase 做完之后，你能看到什么、能做什么。
2. **要建/改的文件**：清单。
3. **要装的依赖**：npm 包。
4. **给 AI 助手的提示词模板**：复制粘贴到新对话开头，让 AI 知道做什么。
5. **验收标准**：什么算"做完了"。

**重要**：每个 phase 做完后，先验收再开下一个。验收方法：跑起来用一下，确认目标达成。如果中途卡住超过 30 分钟，回到对话里跟 AI 描述卡哪、报什么错。

---

## Phase 0 · 项目脚手架

### 目标
能跑起来一个空 Electron + React 窗口，标题写 "BinTools"，里面显示 "Hello"。能热重载。

### 要建/改的文件
```
package.json
tsconfig.json
vite.config.ts
tailwind.config.js
postcss.config.js
index.html
electron/main.ts
electron/preload.ts
src/main.tsx
src/App.tsx
src/styles/globals.css
.gitignore（已存在，可能要补几条）
```

### 要装的依赖
```bash
# 运行依赖
npm i react react-dom

# 开发依赖
npm i -D electron vite vite-plugin-electron vite-plugin-electron-renderer
npm i -D @vitejs/plugin-react typescript @types/react @types/react-dom
npm i -D tailwindcss postcss autoprefixer
npm i -D concurrently wait-on
```

### 给 AI 助手的提示词
```
帮我用 Vite + Electron + React + TypeScript + Tailwind CSS 搭一个空的桌面应用脚手架。
项目根目录是 /Users/zebinli/Desktop/bintools。
要求：
1. npm run dev 启动后打开一个 Electron 窗口，显示 "Hello, BinTools"
2. 修改 React 代码能热重载
3. 主进程（electron/main.ts）和渲染进程（src/）分离清楚
4. preload.ts 用 contextIsolation 安全暴露 IPC（先留空，后面 phase 加东西）
5. Tailwind 跑通（在 App.tsx 里用 className="text-2xl" 能看到效果）
请直接生成所有文件内容并告诉我装哪些 npm 包。
```

### 验收
- `npm run dev` 能跑起来；
- Electron 窗口打开，显示 "Hello, BinTools"；
- 改 `src/App.tsx` 里的文字保存后窗口自动刷新；
- 控制台没有红字错误。

---

## Phase 1 · 设计系统基础

### 目标
建立 Claude.com 风格的视觉基础：字体、配色、几个核心 UI 组件（按钮、Tooltip、分割线）。在 App 里放一个临时演示页，看到所有组件长啥样。

### 要建/改的文件
```
tailwind.config.js（配色、字体 token）
src/styles/globals.css（导入字体）
src/components/ui/Button.tsx
src/components/ui/Tooltip.tsx
src/components/ui/Divider.tsx
src/components/ui/Card.tsx（克制版，不重的）
src/App.tsx（暂时改成演示页）
```

### 要装的依赖
```bash
npm i lucide-react @radix-ui/react-tooltip
```

### 给 AI 助手的提示词
```
基于 Phase 0 的脚手架，建立 Claude.com 风格的设计系统。要求：
1. Tailwind 配置加入这些 token：
   - 背景色 cream: #FAF9F5
   - 文字 ink: #2D2A26
   - 强调色 terracotta: #CC785C
   - 衬线字体（serif）用 Source Serif 4，正文（sans）用 Inter
2. globals.css 里 import 字体（Google Fonts CDN 或本地都行）
3. 写 4 个组件：Button、Tooltip（基于 @radix-ui/react-tooltip）、Divider（细横线 + 标签）、Card（克制版，几乎无阴影边框）
4. App.tsx 改成临时演示页，分两栏：左栏列出所有按钮变体（primary/secondary/ghost），右栏放一段 Serif 大标题 + Sans 正文 + 一个 Tooltip 示例。
保持 Claude.com 的克制感：留白多、阴影几乎无、不要花哨。
```

### 验收
- 背景是奶油色不是纯白；
- 大标题是衬线字体；
- 按钮悬停有微妙的颜色变化但没有阴影乱跳；
- 鼠标移到 Tooltip 触发器上能看到提示。

---

## Phase 2 · 欢迎页 + Excel 文件上传

### 目标
启动 app 看到欢迎页：一个上传按钮 + 几个示例数据集卡片。点上传弹出系统文件选择器，能选 .xlsx，控制台打印解析出来的表格数据。点示例卡片同样能打印数据。

### 要建/改的文件
```
electron/main.ts（加 IPC：showOpenDialog 返回文件路径）
electron/preload.ts（暴露 openExcelFile 给渲染进程）
src/types/ipc.d.ts（IPC 类型声明）
src/components/WelcomeScreen.tsx
src/components/ExampleDatasetCard.tsx
src/services/fileLoader.ts（用 xlsx 库解析）
src/data/examples/small-demo.xlsx（手动准备一个示例）
src/data/examples/index.ts（示例数据集元数据列表）
src/App.tsx（改成显示 WelcomeScreen）
```

### 要装的依赖
```bash
npm i xlsx
```

### 给 AI 助手的提示词
```
基于 Phase 1，实现欢迎页和 Excel 上传：
1. 主进程加 IPC 处理 'dialog:openExcel'，调 dialog.showOpenDialog 弹文件选择器（只接受 .xlsx .xls），返回文件路径
2. preload.ts 暴露 window.api.openExcelFile() 给渲染层
3. fileLoader.ts 接收路径 → 用 SheetJS（xlsx 库）解析 → 返回 { sheets: SheetData[] } 结构，其中 SheetData = { name, rows: any[][] }
4. WelcomeScreen.tsx：
   - 顶部一个大 Serif 标题 "BinTools"
   - 副标题"上传 Excel，几步导出发表级别的热图"
   - 中间一个大上传按钮（terracotta 强调色）
   - 下方一行小字 "或试试示例数据"，下面 3 个 ExampleDatasetCard
5. ExampleDatasetCard：卡片显示数据集名 + 简介（如 "20 基因 × 6 样本"），点击触发同样的解析流程
6. 暂时把解析结果 console.log 出来，下个 phase 接进数据预览
所有交互保持克制：按钮 hover 仅颜色微变，不要 transform 跳动。
```

### 验收
- 启动看到欢迎页，视觉风格统一；
- 点上传 → 文件选择器弹出 → 选一个 xlsx → 控制台打印出 sheets 数组；
- 点示例卡片 → 控制台打印示例数据；
- 选了非 Excel 文件，文件选择器自己会过滤掉（系统能力）。

---

## Phase 3 · 数据预览 + 校验 + 列映射

### 目标
上传文件后进入"数据预览"页：显示前 10 行 + sheet 选择器（如多 sheet）+ 自动识别的"基因名列"高亮 + 自动识别失败时的手动列映射 UI。底部一个"确认"按钮。

### 要建/改的文件
```
src/types/data.ts（BinToolsDataset 类型）
src/services/dataValidator.ts
src/components/DataPreview.tsx
src/components/SheetSelector.tsx
src/components/ColumnMappingFallback.tsx
src/App.tsx（加路由：welcome → preview）
```

### 给 AI 助手的提示词
```
基于 Phase 2 的解析结果，实现数据预览和校验：
1. types/data.ts 定义：
   - RawSheet = { name: string, rows: any[][] }
   - BinToolsDataset = { geneIds: string[], sampleIds: string[], matrix: number[][], missingCount: number }
2. dataValidator.ts 提供 validateAndStructure(sheet: RawSheet) => 
   { ok: true, dataset: BinToolsDataset } | { ok: false, issue: 'no_string_first_col' | 'no_numeric_data' | 'duplicate_genes' | ..., details }
   - 自动判断第一列是否字符串（基因名）
   - 重复基因名加 _1 _2 后缀
   - 缺失值（空 / NA / NaN / -）统一记录数量
3. DataPreview.tsx：表格形式显示前 10 行，基因名列高亮（左侧细竖线 + terracotta 颜色），底部"确认"按钮
4. 多 sheet 时顶部加 SheetSelector（下拉）
5. 如果 validateAndStructure 返回 ok:false 且原因是列识别失败，显示 ColumnMappingFallback：让用户点表头某列说"这是基因名列"
6. App.tsx 加简单路由（用 useState 切换 view，不引 react-router）：welcome → preview，点确认进入下一个 view（暂时只 console.log dataset）
保持视觉克制，表格用细横线分隔行，不要每行都加背景色斑马纹。
```

### 验收
- 上传干净数据 → 预览正确显示，基因名列高亮；
- 上传第一列是数字的奇怪数据 → 进列映射 UI，能手动指定；
- 上传含重复基因名的数据 → 顶部黄色横幅警告；
- 多 sheet xlsx → 能切换；
- 点"确认" → 控制台输出结构化的 BinToolsDataset。

---

## Phase 4 · 主界面布局 + 状态管理

### 目标
确认数据后进入主界面：左侧参数面板（先放骨架，几个空的分组标题）+ 右侧大画布（暂留空白说"热图占位"）+ 顶部 logo + 导出按钮（暂未实现）。状态管理用 Zustand 起来。

### 要建/改的文件
```
src/store/appStore.ts（Zustand）
src/types/params.ts（HeatmapParams 类型，所有参数的默认值）
src/components/MainLayout.tsx
src/components/TopBar.tsx
src/components/ParameterPanel.tsx（骨架版本）
src/components/HeatmapCanvas.tsx（占位版本）
src/App.tsx（加 main view）
```

### 要装的依赖
```bash
npm i zustand
```

### 给 AI 助手的提示词
```
基于 Phase 3，搭主界面骨架和全局状态：
1. types/params.ts 定义 HeatmapParams（所有参数+默认值，参考设计文档 7.1）：
   - normalization: 'none' | 'zscore_row' | 'log2' | 'mean_center'，默认 'zscore_row'
   - clusterRows: boolean，默认 true
   - clusterCols: boolean，默认 true
   - distanceRow / distanceCol: 'euclidean' | 'correlation' | 'manhattan'
   - linkageMethod: 'ward' | 'complete' | 'average' | 'single'，默认 'ward'
   - colorScheme: string id
   - colorRange: 'auto' | { min, max }
   - showRowNames / showColNames: boolean
   - rowFontSize / colFontSize: number
   - width / height: number
   - fitWindow: boolean
2. store/appStore.ts（Zustand）：
   - dataset: BinToolsDataset | null
   - params: HeatmapParams
   - setDataset(d), setParam(key, value), resetParams()
3. MainLayout.tsx：grid 布局，左 320px 固定宽，右剩余宽度
4. TopBar.tsx：高约 56px，左侧 Serif logo "BinTools"，右侧"导出"按钮（暂不实现功能）
5. ParameterPanel.tsx 骨架：5 个分组（数据/归一化/聚类/外观/尺寸），每组只放标题 + 空内容
6. HeatmapCanvas.tsx 占位：中央灰色文字 "热图将在这里显示"
7. App.tsx 完整流：welcome → preview → main
```

### 验收
- 走完全流程能进到主界面；
- 主界面布局对：顶部条 + 左面板 + 右画布；
- Zustand store 能用（在 React DevTools 看得到状态）；
- 调整窗口大小，右侧画布跟着变。

---

## Phase 5 · 参数面板完整版

### 目标
每个参数都能调，每个参数旁有 `?` Tooltip 解释。调参数立刻更新 Zustand store。还没接图表，所以调了暂时只能在控制台看 state 变。

### 要建/改的文件
```
src/components/ParameterPanel.tsx（重写为完整版）
src/components/parameter-groups/DataGroup.tsx
src/components/parameter-groups/NormalizationGroup.tsx
src/components/parameter-groups/ClusteringGroup.tsx
src/components/parameter-groups/AppearanceGroup.tsx
src/components/parameter-groups/SizeGroup.tsx
src/components/ui/Radio.tsx, Checkbox.tsx, Select.tsx, NumberInput.tsx
src/components/ParameterTooltip.tsx（包装 ? 图标 + 解释文字）
src/data/parameterHelp.ts（每个参数的人话解释）
```

### 给 AI 助手的提示词
```
基于 Phase 4，实现参数面板所有控件。参考设计文档第 7 节的字段表。
要求：
1. 每个分组一个文件，对应一个 React 组件
2. 通用控件 Radio/Checkbox/Select/NumberInput 放 src/components/ui/，样式和 Phase 1 的设计系统一致
3. ParameterTooltip 组件：接收 helpKey（如 'normalization.zscore'），从 data/parameterHelp.ts 查出人话解释，渲染一个小 ? 图标，悬停弹出
4. parameterHelp.ts 写完所有参数的解释（参考设计文档 7.1），每条 1 句话，用日常语言不用术语
5. 所有控件 onChange 调 store.setParam
6. "高级"选项（曼哈顿距离、ward.D 以外的 linkage）默认折叠在一个可展开区域
7. 默认值参考设计文档：归一化默认 Z-score，聚类默认开，距离默认欧氏，颜色默认红蓝
分组之间用 Phase 1 的 Divider 分隔，整体不要卡片化。
```

### 验收
- 所有参数都能交互；
- 每个参数旁有 ?，悬停看到人话解释；
- "高级"区默认折叠，点开能看到 ward.D 等；
- 改任何参数 → Zustand DevTools 看到 state 变化。

---

## Phase 6 · 数据处理流水线

### 目标
归一化和聚类的算法接通：参数变 → 计算重跑 → 输出新矩阵和顺序。先不画图，只在控制台或一个临时区域看数值变化。加 200ms 防抖。

### 要建/改的文件
```
src/services/normalizer.ts
src/services/clustering.ts
src/hooks/useProcessedData.ts（reactive recompute）
src/types/processed.ts（ProcessedDataset 类型）
src/components/HeatmapCanvas.tsx（暂时显示处理后的前 5 行 5 列做验证）
```

### 要装的依赖
```bash
npm i ml-hclust
npm i use-debounce
```

### 给 AI 助手的提示词
```
基于 Phase 5，实现归一化和聚类的纯函数：
1. normalizer.ts 提供 normalize(matrix, mode) => matrix:
   - 'none': 原样返回
   - 'zscore_row': 每行减均值除以行内标准差，全 0 行不变
   - 'log2': log2(x + 1) 防 log(0)
   - 'mean_center': 每行减自己均值
2. clustering.ts 提供 hierarchicalCluster(matrix, axis: 'row' | 'col', distance, linkage) => 
   { order: number[], dendrogram: ... }
   - 用 ml-hclust，包好它的 API
   - distance: 欧氏/相关性（1 - Pearson）/曼哈顿
3. hooks/useProcessedData.ts：
   - 监听 dataset + params 变化（Zustand）
   - 200ms 防抖（use-debounce）
   - 链路：原始 → normalize → cluster rows → cluster cols → 返回 ProcessedDataset = { matrix, rowOrder, colOrder, rowDendrogram, colDendrogram }
   - 用 useMemo 避免重复计算
   - 失败时（如全 0 行未清理）退化为不聚类，返回带 warning 字段
4. HeatmapCanvas 暂时显示：处理后的矩阵前 5×5 数值表 + rowOrder/colOrder 数组（验证用）
```

### 验收
- 切归一化模式 → 数值表立刻变；
- 切聚类开关 → order 数组变；
- 极端数据（全 0 行）→ 看到 warning 提示但不崩；
- 改参数频繁切 → 200ms 内只重算一次（用 console.time 验证）。

---

## Phase 7 · 热图渲染

### 目标
真正画出热图。Plotly.js 渲染矩阵 + 树状图 + 颜色条 + 行列标签。所有参数都生效。

### 要建/改的文件
```
src/services/plotlyConfig.ts（颜色方案表、layout 配置）
src/components/HeatmapCanvas.tsx（重写为完整版）
src/data/colorSchemes.ts（红蓝、白红、Viridis 等）
```

### 要装的依赖
```bash
npm i plotly.js-dist-min
# 注意：react-plotly.js 可选，但更稳的做法是直接用 plotly.js + useEffect + useRef
```

### 给 AI 助手的提示词
```
基于 Phase 6 的 ProcessedDataset，用 Plotly.js 画热图：
1. colorSchemes.ts 定义至少 5 套配色：红-白-蓝（默认）、白-红、Viridis、Magma、绿-黄
   每套是 colorscale 数组 [[0, '#...'], [0.5, '#...'], [1, '#...']]
2. plotlyConfig.ts 提供 buildHeatmapConfig(processedData, params) => { data, layout, config }：
   - 主热图 + 行/列树状图（如聚类开启）
   - colorbar 在右侧
   - 行/列标签按参数显示/隐藏
   - 字号、颜色范围都按 params
3. HeatmapCanvas.tsx：
   - 用 useRef 持有 div，useEffect 中 Plotly.react(div, data, layout, config) 重绘
   - 监听 processedData 和 params 变化
   - 处理 resize（窗口变大时调 Plotly.Plots.resize）
   - 加 loading 状态（重算时显示淡淡的 "渲染中..."）
4. 大数据（>2000 行）时 colorscale 用 heatmapgl 类型加速
```

### 验收
- 看到带聚类树的真热图；
- 切颜色方案 → 立刻变色；
- 关掉行聚类 → 树消失，行恢复原顺序；
- 字号改大 → 行列名变大；
- 窗口拉伸 → 热图跟着自适应。

---

## Phase 8 · 导出图片

### 目标
点右上角"导出"弹下拉菜单（PNG / JPG / SVG / PDF），选完弹系统保存对话框，保存到本地。

### 要建/改的文件
```
electron/main.ts（加 IPC：dialog:saveAs）
electron/preload.ts（暴露 saveFile）
src/services/exporter.ts
src/components/ExportMenu.tsx（下拉菜单）
src/components/TopBar.tsx（接入 ExportMenu）
```

### 要装的依赖
```bash
npm i jspdf
```

### 给 AI 助手的提示词
```
基于 Phase 7，实现导出：
1. 主进程加 IPC 'dialog:saveAs'：参数 (defaultFileName, filters) → 返回选好的路径（或 null 取消）
2. preload.ts 暴露 window.api.saveFile(path, buffer 或 svgString)
3. exporter.ts：
   - exportPng/Jpg(plotlyDiv, scale=2)：调 Plotly.toImage 拿 dataURL → 转 Buffer → IPC 保存
   - exportSvg(plotlyDiv)：Plotly.toImage 取 'svg' 格式 → 直接保存字符串
   - exportPdf(plotlyDiv)：先拿 SVG，用 jspdf + svg2pdf（如复杂就用 PNG 嵌入 PDF）保存
4. ExportMenu.tsx：下拉显示 4 个选项，点击调对应导出函数
5. 导出中显示 spinner，完成后顶部弹一个绿色 toast "已保存到 [路径]"
6. 失败时弹红色 toast 写明原因
PNG/JPG 默认 2x 分辨率，SVG/PDF 保持矢量。
```

### 验收
- 4 种格式都能导出；
- PNG 打开看是清晰的（非锯齿）；
- SVG 用 Illustrator 打开看是可编辑的矢量；
- 取消保存对话框 → 不出错；
- 写入无权限路径 → 看到红色错误提示而不是崩。

---

## Phase 9 · 错误处理 + 完整 UX

### 目标
设计文档第 8 节的所有错误场景都有对应的 UI 提示。app 不会因为任何输入崩溃。

### 要建/改的文件
```
src/components/ErrorBoundary.tsx
src/components/Toast.tsx, Banner.tsx
src/store/uiStore.ts（toast/banner state）
src/services/errorHandler.ts（错误归类 + 文案表）
（修改）所有 service 文件加错误处理
```

### 给 AI 助手的提示词
```
基于已有所有 phase，把错误处理补齐。参考设计文档第 8 节的错误表：
1. ErrorBoundary 包裹整个 App，捕获 React 渲染错误，显示降级 UI（"渲染出错，请简化数据或重试"）
2. Toast/Banner UI 组件：
   - Toast：右下角短暂弹出（3 秒），用于操作反馈（"已保存"、"复制成功"）
   - Banner：顶部持续显示，可关闭，用于警告（"30% 缺失值"等）
3. uiStore.ts 管理 toast/banner 队列
4. errorHandler.ts：错误码 → 人话文案 映射表，覆盖设计文档所有场景
5. 改 fileLoader/dataValidator/normalizer/clustering：抛错时调 errorHandler，渲染层 catch 后 showToast/showBanner
6. 数据规模过大确认框（>5000 行或 >50 列）用 Radix Dialog
7. 聚类失败自动退化为"不聚类模式"，顶部 banner 说明
```

### 验收
- 故意上传坏掉的文件 → 看到"文件无法打开"；
- 上传全 0 的奇怪数据 → 看到 banner 警告，没崩；
- 5000 行数据 → 弹确认框；
- 没磁盘写权限的位置导出 → 红色 toast；
- 故意在代码里 throw 测试 ErrorBoundary → 降级 UI 出现。

---

## Phase 10 · 单元测试 + 示例数据集

### 目标
关键算法有测试。准备好 5 个示例 xlsx 文件（覆盖典型 + 边界）放进项目，欢迎页内置示例数据集卡片用这些文件。

### 要建/改的文件
```
vitest.config.ts
src/services/normalizer.test.ts
src/services/clustering.test.ts
src/services/dataValidator.test.ts
tests/fixtures/small_clean.xlsx
tests/fixtures/medium_normal.xlsx
tests/fixtures/large_stress.xlsx
tests/fixtures/with_missing.xlsx
tests/fixtures/weird_format.xlsx
tests/manual-checklist.md
src/data/examples/index.ts（指向 fixture 文件）
```

### 要装的依赖
```bash
npm i -D vitest @testing-library/react jsdom
```

### 给 AI 助手的提示词
```
基于已有所有代码，加测试：
1. vitest.config.ts 配置 jsdom 环境
2. normalizer.test.ts：
   - z-score 行内：手算几个简单例子对照
   - log2：测 0 不会 -Inf
   - 全 0 行处理
3. clustering.test.ts：
   - 简单矩阵的层次聚类结果稳定
   - 全相同行不崩
   - 距离选项切换
4. dataValidator.test.ts：
   - 第一列字符串 vs 数字
   - 重复基因名加后缀
   - NA / 空 / "-" 都识别为缺失
5. tests/manual-checklist.md：列出 30 项左右的手测清单（上传→预览→调参→导出，覆盖每个参数和每个错误场景）

示例数据集 xlsx 文件先空着，用户自己准备，但提供生成器脚本 scripts/generate-fixtures.ts，能用随机数生成符合每种规格的 xlsx。
```

### 验收
- `npm test` 全绿；
- 5 个 fixture 文件都能跑 app 完整流程；
- 手测清单存在且条目清晰；
- 示例数据集卡片在欢迎页点了能正常加载。

---

## Phase 11 · 打包发布

### 目标
能产出 Mac 的 .dmg 和 Windows 的 .exe 安装包。装上能正常用。

### 要建/改的文件
```
electron-builder.config.js
build/icon.png（1024x1024）
build/icon.icns（Mac 图标）
build/icon.ico（Windows 图标）
package.json（scripts 加 build）
README.md（终于有理由写了）
```

### 要装的依赖
```bash
npm i -D electron-builder
```

### 给 AI 助手的提示词
```
基于已有项目，配置打包：
1. electron-builder.config.js：
   - appId: com.bintools.app
   - productName: BinTools
   - directories.output: release
   - mac: .dmg 格式，universal（intel + arm64）
   - win: .exe NSIS 安装包
   - 图标路径
2. package.json scripts：
   - "build": "vite build && electron-builder"
   - "build:mac": "vite build && electron-builder --mac"
   - "build:win": "vite build && electron-builder --win"
3. README.md：写清楚是干嘛的、装哪里、怎么用、链接到 design doc
4. 图标：先用 ImageMagick 或在线工具从 1024 png 转 icns/ico

Windows 编译只能在 Windows 上做（或用 GitHub Actions），Mac 同理。先在 Mac 上跑 build:mac 验证。
```

### 验收
- `npm run build:mac` 产出 .dmg；
- 双击 .dmg 拖进 Applications；
- 启动新装的 app，能跑完整流程（上传 → 调参 → 导出）；
- README.md 写得让小白也能看懂。

---

## 通用提醒

1. **跨 phase 上下文**：每次开新对话让 AI 实现一个 phase 时，把这份文档 + 设计文档 + 上一个 phase 完成后的项目代码（或者只 link 到 GitHub 仓库）都给它。
2. **不确定就先问**：如果 AI 给的方案你看不懂为啥这么做，让它解释一下原因再开始写。
3. **小步提交**：每个 phase 做完 commit 一次，commit message 写清楚 phase 几做了什么。这样回退方便。
4. **遇到玄学 bug**：先看终端报错前 20 行（很多人只看最后一行漏关键信息），然后把报错完整复制给 AI。
5. **不要跳 phase**：phase 之间是有依赖的，跳着做会卡。

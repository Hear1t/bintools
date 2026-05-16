# 进化树（Phylogenetic Tree）功能设计

**日期**: 2026-05-17
**作为 BinTools 第 3 个功能模块加入**（与热图、共现网络并列）

---

## 用户需求

- **输入**：FASTA 文件（用户不需要知道是否已对齐，软件自动判断）
- **建树**：内置算法，无需外部工具
- **布局**：矩形 + 圆形可切换
- **着色**：自动从序列名前缀（下划线/竖线之前部分）提取分组着色
- **风格**：沿用现有终端暗色 UI

## 流水线

```
FASTA 文件 → 解析 SequenceSet
           → 检测是否等长
              ├ 全等长：p-distance
              └ 不等长：k-mer Jaccard（k=5）
           → Neighbor-Joining 算法
           → 二叉树结构
           → 前缀分组提取
           → PhyloData
           → D3 矩形/圆形渲染
```

## 新增文件

| 文件 | 职责 |
|------|------|
| `src/types/phylo.ts` | PhyloNode, PhyloEdge, PhyloData, PhyloParams 类型 |
| `src/services/fastaParser.ts` | 解析 FASTA 文本，返回 `[{name, sequence}, …]` |
| `src/services/distance.ts` | p-distance + k-mer Jaccard 两种实现 |
| `src/services/neighborJoin.ts` | Saitou & Nei (1987) NJ 算法 |
| `src/services/phyloBuilder.ts` | 上游编排 + 前缀分组 |
| `src/services/newickExport.ts` | 二叉树 → Newick 字符串 |
| `src/services/phyloExporter.ts` | PNG/SVG/Newick 三种导出（PNG/SVG 复用 NetworkCanvas 思路）|
| `src/store/phyloStore.ts` | params + 已解析数据 |
| `src/hooks/usePhyloTree.ts` | 响应式（debounce 200ms）|
| `src/components/PhyloCanvas.tsx` | D3 渲染矩形/圆形 |
| `src/components/PhyloParamPanel.tsx` | 参数面板 |

## 修改文件

| 文件 | 改动 |
|------|------|
| `src/App.tsx` | `Feature` 类型加 `'phylo'` |
| `src/components/WelcomeScreen.tsx` | 第三张功能卡 + FASTA 上传通道 |
| `src/components/MainLayout.tsx` | 第三个 tab 分支条件渲染 |
| `src/components/TopBar.tsx` | `TAB_LABEL.phylo = 'PHYLO'` |
| `electron/main.ts` | 新增 IPC `dialog:openText`：dialog → readFile → 字符串 |
| `src/services/fileLoader.ts` | 新增 `loadFastaFromUpload()` |

## 数据类型

```typescript
interface PhyloSequence {
  name: string
  sequence: string
  length: number
}

interface PhyloNode {
  id: string         // 'leaf-0' / 'internal-3'
  name?: string      // 叶节点用序列名，内部节点不用
  isLeaf: boolean
  group?: string     // 仅叶节点
  groupColor?: string
  // D3 layout 填充
  x?: number; y?: number; depth?: number
  children?: PhyloNode[]
}

interface PhyloEdge {
  source: PhyloNode
  target: PhyloNode
  length: number    // 分支长度
}

interface PhyloData {
  root: PhyloNode
  leaves: PhyloNode[]
  edges: PhyloEdge[]
  groups: Record<string, string>  // group → color
  stats: {
    sequenceCount: number
    avgLength: number
    isAligned: boolean
    distanceMethod: 'p-distance' | 'k-mer'
  }
}

interface PhyloParams {
  layout: 'rectangular' | 'circular'
  branchMode: 'proportional' | 'cladogram'
  leafFontSize: number
  showBranchLength: boolean
  nodeOrdering: 'ascending' | 'descending' | 'none'
}
```

## 算法细节

### p-distance
对齐序列 `s1, s2`：`d = mismatches / (length - gaps)`

### k-mer Jaccard（unaligned 时）
k=5。每条序列提取所有 5-mer 集合，两序列距离 = `1 - |A∩B| / |A∪B|`。

### Neighbor-Joining
- 标准 Saitou & Nei 算法
- 输入：n×n 对称距离矩阵
- 输出：无根二叉树
- 根：取最远叶节点对的中点（midpoint rooting）

### 分组前缀提取
按以下顺序匹配序列名分隔符，第一个出现的就是分隔点：`_`, `|`, `-`, `/`。
取分隔符前的部分作为组名。如果只有一组（所有序列同前缀），就退化成单色。

## 视觉规格

- **节点圆点**：4px，按 group 着色
- **分支线**：1.2px，与叶节点同色
- **标签**：mono 11px，与节点同色
- **悬停 tooltip**：`序列名 / 长度 X bp / 分组 Y`
- **统计栏**（底部）：`序列 N · 平均 L bp · [aligned|unaligned] · [p-distance|k-mer]`
- **图例**（右下）：列出所有 group + 颜色，行数动态
- **背景 / 边框**：复用 `bg-cream` / `border-line`，自动跟随主题
- **D3 SVG 内联颜色**：从 `getThemeColors(theme)` 取，主题切换时 useEffect 重绘

## 规模保护

- > 200 序列：ConfirmDialog 警告（NJ 是 O(n³)，可能 5+ 秒）
- > 1000 序列：拒绝上传，提示精简

## 导出

| 格式 | 实现 |
|------|------|
| PNG | SVG → base64 → canvas drawImage → toBlob |
| SVG | SVG DOM → XMLSerializer → 直接写文件 |
| Newick | 后序遍历输出 `(child1:len, child2:len)label:len;` |

ExportMenu 改成接受 `mode: 'plotly' | 'svg'` props：
- heatmap → plotly
- network / phylo → svg

## 不在 MVP 范围

- ❌ Bootstrap support 值（NJ 本身不带；要做需要 bootstrap resampling）
- ❌ JC69 / K2P 距离修正（p-distance 够用）
- ❌ 节点折叠/展开
- ❌ 自定义分组（除自动前缀外）
- ❌ Newick / NEXUS 输入（先解决 FASTA 一条路径，未来再加）

## 验证标准

1. 上传 50 序列对齐 FASTA（如 12S rRNA） → < 1 秒出树
2. 上传 50 序列不等长 FASTA → 自动切 k-mer，< 2 秒出树
3. 序列名 `Human_HBB / Mouse_HBB / Rat_HBB` → 自动分 Human/Mouse/Rat 三组着色
4. 矩形 ↔ 圆形切换平滑无闪烁
5. 暗色 ↔ 亮色主题切换，树颜色同步
6. 导出 PNG/SVG/Newick 三格式都能在外部软件打开

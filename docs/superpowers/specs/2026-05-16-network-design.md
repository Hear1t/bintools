# 微生物共现网络图设计文档

**日期**: 2026-05-16  
**原则**: 只增不改，现有热图功能完全不动

---

## 数据流

```
上传 Excel → Validator 提取 taxonLabels（可选第二列 Taxonomy）
           → BinToolsDataset { geneIds, sampleIds, matrix, taxonLabels? }
           ↓
Tab = 热图  → 现有流程（不变）
Tab = 网络  → useNetworkData (200ms debounce)
              → correlation.ts: 行-行 Spearman/Pearson + Fisher p 值 + BH-FDR
              → networkBuilder.ts: 按阈值筛边 → NetworkData
              → NetworkCanvas.tsx: D3 force simulation → SVG
```

## 修改文件（最小改动）

| 文件 | 改动 |
|------|------|
| `src/types/data.ts` | 加 `taxonLabels?: string[]` |
| `src/services/dataValidator.ts` | 检测第二列是否为 Taxonomy 列并提取 |
| `src/components/MainLayout.tsx` | 加 tab 状态，条件渲染热图/网络 |
| `src/components/TopBar.tsx` | 加 Tab 切换 UI |

## 新增文件

- `src/types/network.ts` — NetworkNode, NetworkEdge, NetworkData, NetworkParams
- `src/services/correlation.ts` — Spearman/Pearson + Fisher z p值 + BH-FDR
- `src/services/networkBuilder.ts` — 构建 NetworkData
- `src/services/taxonomyParser.ts` — 解析 GreenGenes/SILVA 分类字符串
- `src/store/networkStore.ts` — Zustand 网络参数状态
- `src/hooks/useNetworkData.ts` — 响应式网络数据计算钩子
- `src/components/NetworkCanvas.tsx` — D3 force-directed 可视化
- `src/components/NetworkParamPanel.tsx` — 网络参数面板

## 参数

| 参数 | 默认值 |
|------|--------|
| 方法 | Spearman |
| \|r\| 阈值 | 0.6 |
| p 阈值 | 0.05 |
| 显著性校正 | FDR (BH) |
| 分类层级 | 门 (Phylum) |
| 正相关色 | #E05252 |
| 负相关色 | #52A0E0 |

## 视觉规格

- 节点：圆，按门着色，大小 6–28px 按 degree 映射
- Hub OTU：degree ≥ top 10%，加红色描边圆环
- 边：正相关红，负相关蓝绿；宽度 1–3px 按 |r| 映射
- 交互：拖拽节点、滚轮缩放平移、悬停 tooltip
- 图例：右下角（门颜色 + 边方向）
- 统计：左下角（节点数 · 边数 · 正相关% · 负相关%）
- 背景：#FAF9F5

## Taxonomy 解析

1. GreenGenes: `k__Bacteria;p__Firmicutes` → 提取 `p__` 后内容
2. SILVA: `Bacteria;Firmicutes;Bacilli` → 第 2 段
3. 无法识别 → `Unclassified`（灰色）

## 导出

PNG/SVG 复用现有 ExportMenu，getPlotElement 指向 NetworkCanvas SVG 容器。PDF 不支持。

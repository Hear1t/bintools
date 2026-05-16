export const parameterHelp: Record<string, string> = {
  // Normalization
  'normalization.none':
    '原样使用上传的数值，不做任何变换。适合已经处理过的数据。',
  'normalization.zscore_row':
    '每个基因独立标准化到 -2~+2 区间，让"哪些样本相对偏高/偏低"一眼看清楚。最常用。',
  'normalization.log2':
    '把数值取 log2（自动 +1 防 log(0)）。适合 raw count 或动态范围跨几个数量级的数据。',
  'normalization.mean_center':
    '每个基因减自己的均值，保留绝对差异。适合关注偏离平均的程度。',

  // Clustering
  'cluster.rows':
    '把表达模式相似的基因排在一起。开启后行的顺序会被重排，画出树状图。',
  'cluster.cols':
    '把整体相似的样本排在一起。开启后列的顺序会被重排，画出树状图。',
  'cluster.distance.euclidean':
    '欧氏距离：最常见。两个向量在多维空间里的直线距离。',
  'cluster.distance.correlation':
    '相关性距离：1 - Pearson 相关系数。关心"趋势是否相似"，不在意数值绝对大小。',
  'cluster.distance.manhattan':
    '曼哈顿距离：各维差值的绝对值之和。对异常值不那么敏感。',
  'cluster.linkage.ward':
    'Ward.D：最小化合并后的方差增加。常见默认，树形紧凑。',
  'cluster.linkage.complete':
    'Complete：用两组中最远的两点的距离合并。树形更平衡。',
  'cluster.linkage.average':
    'Average：用两组所有点对距离的平均值合并。介于 ward 和 complete 之间。',
  'cluster.linkage.single':
    'Single：用两组中最近的两点合并。容易产生"链式"长树。',

  // Appearance
  'color.scheme':
    '配色方案。Z-score 归一化后推荐红-白-蓝（双向，红高蓝低）。',
  'color.range':
    '颜色对应的数值范围。"自动"用数据本身的最小/最大；"手动"可固定范围，方便多张图横向比较。',
  'show.rowNames': '是否在热图右侧显示每个基因的名字。',
  'show.colNames': '是否在热图下方显示每个样本的名字。',
  'font.row': '行名字号。基因多时可调小到 6-8。',
  'font.col': '列名字号。样本名长时可调小到 6-8。',
  'cell.border':
    '单元格之间的描边粗细。"无"最干净；"细"在数据量小时更易辨认。',

  // Size
  'size.width': '导出图的宽度（像素）。',
  'size.height': '导出图的高度（像素）。',
  'size.fit': '画布跟随窗口大小自适应。关闭后使用固定宽高。',
}

import type { ParsedFile } from '@/types/sheet'

export const transcriptomeDemoExample: ParsedFile = {
  source: 'example',
  fileName: 'transcriptome_demo.xlsx',
  sheets: [
    {
      name: 'expression',
      rows: [
        ['Gene', 'Ctrl_1', 'Ctrl_2', 'Ctrl_3', 'Treat_1', 'Treat_2', 'Treat_3', 'Treat_4'],
        ['IL6', 12, 15, 18, 245, 312, 289, 256],
        ['TNF', 23, 19, 31, 412, 489, 445, 398],
        ['IFNG', 8, 11, 9, 156, 178, 167, 145],
        ['CXCL10', 5, 7, 6, 234, 256, 245, 212],
        ['NFKB1', 1234, 1156, 1298, 3245, 3412, 3289, 3156],
        ['STAT1', 567, 612, 589, 2245, 2412, 2289, 2156],
        ['IRF7', 234, 245, 256, 1245, 1412, 1289, 1156],
        ['MX1', 89, 95, 102, 2245, 2412, 2089, 1956],
        ['ISG15', 156, 167, 178, 3245, 3589, 3456, 3289],
        ['OAS1', 245, 256, 234, 1645, 1789, 1656, 1589],
        ['GAPDH', 8521, 8456, 8602, 8754, 8612, 8589, 8623],
        ['ACTB', 9221, 9156, 9302, 9354, 9212, 9189, 9223],
      ],
    },
  ],
}

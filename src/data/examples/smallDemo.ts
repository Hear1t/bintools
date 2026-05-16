import type { ParsedFile } from '@/types/sheet'

export const smallDemoExample: ParsedFile = {
  source: 'example',
  fileName: 'small_demo.xlsx',
  sheets: [
    {
      name: 'Sheet1',
      rows: [
        ['', 'Tumor_1', 'Tumor_2', 'Tumor_3', 'Normal_1', 'Normal_2', 'Normal_3'],
        ['GAPDH', 1245, 1356, 1188, 1422, 1198, 1322],
        ['ACTB', 8932, 9201, 8845, 9388, 9012, 9156],
        ['B2M', 4221, 4456, 4102, 4388, 4156, 4290],
        ['TP53', 234, 198, 301, 567, 612, 589],
        ['MYC', 1023, 1188, 956, 412, 387, 445],
        ['EGFR', 2103, 2298, 1956, 654, 612, 589],
        ['BRCA1', 89, 102, 78, 234, 256, 245],
        ['CDKN2A', 23, 18, 31, 156, 178, 167],
        ['VIM', 3421, 3656, 3102, 1156, 1098, 1234],
        ['CDH1', 4521, 4256, 4602, 8654, 8712, 8589],
      ],
    },
  ],
}

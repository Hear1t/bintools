import type { ParsedFile } from '@/types/sheet'

// 18 OTUs × 12 samples — soil microbiome with seasonal gradient
// Samples 1-4: wet season, 5-8: transition, 9-12: dry season
// Creates a clear two-cluster network: wet-loving vs dry-loving taxa
export const soilMicrobiomeDemoExample: ParsedFile = {
  source: 'example',
  fileName: 'soil_microbiome_demo.xlsx',
  sheets: [
    {
      name: 'OTU table',
      rows: [
        [
          'OTU_ID', 'Taxonomy',
          'Wet_1', 'Wet_2', 'Wet_3', 'Wet_4',
          'Trans_1', 'Trans_2', 'Trans_3', 'Trans_4',
          'Dry_1', 'Dry_2', 'Dry_3', 'Dry_4',
        ],
        // ── Proteobacteria (wet-loving) ───────────────────────────────────
        ['OTU001', 'Bacteria;Proteobacteria;Gammaproteobacteria',
          880, 850, 920, 800,   520, 480, 560, 500,   180, 200, 160, 220],
        ['OTU002', 'Bacteria;Proteobacteria;Gammaproteobacteria',
          810, 780, 860, 760,   490, 470, 530, 480,   200, 180, 190, 210],
        ['OTU003', 'Bacteria;Proteobacteria;Alphaproteobacteria',
          750, 790, 830, 710,   470, 440, 500, 460,   170, 160, 180, 150],
        ['OTU004', 'Bacteria;Proteobacteria;Alphaproteobacteria',
          890, 840, 910, 820,   540, 500, 580, 520,   190, 210, 170, 230],
        // ── Bacteroidota (wet-loving) ─────────────────────────────────────
        ['OTU005', 'Bacteria;Bacteroidota;Bacteroidia',
          620, 590, 650, 570,   400, 370, 420, 390,   140, 150, 130, 160],
        ['OTU006', 'Bacteria;Bacteroidota;Bacteroidia',
          700, 660, 730, 640,   440, 410, 460, 430,   160, 170, 140, 180],
        ['OTU007', 'Bacteria;Bacteroidota;Sphingobacteriia',
          550, 520, 580, 500,   360, 340, 380, 350,   120, 130, 110, 140],
        // ── Firmicutes (dry-loving) ───────────────────────────────────────
        ['OTU008', 'Bacteria;Firmicutes;Bacilli',
          180, 200, 160, 190,   490, 510, 470, 500,   860, 830, 880, 810],
        ['OTU009', 'Bacteria;Firmicutes;Bacilli',
          200, 170, 180, 210,   510, 490, 500, 480,   840, 860, 820, 870],
        ['OTU010', 'Bacteria;Firmicutes;Clostridia',
          160, 190, 140, 180,   470, 500, 450, 480,   820, 800, 840, 790],
        // ── Actinobacteria (dry-loving) ───────────────────────────────────
        ['OTU011', 'Bacteria;Actinobacteria;Actinomycetia',
          170, 190, 150, 200,   460, 490, 440, 470,   790, 770, 810, 750],
        ['OTU012', 'Bacteria;Actinobacteria;Actinomycetia',
          190, 160, 180, 210,   490, 460, 480, 500,   830, 810, 850, 790],
        ['OTU013', 'Bacteria;Actinobacteria;Thermoleophilia',
          150, 170, 130, 160,   440, 470, 420, 450,   770, 750, 790, 730],
        // ── Acidobacteria (stable) ────────────────────────────────────────
        ['OTU014', 'Bacteria;Acidobacteria;Acidobacteriae',
          490, 510, 480, 500,   495, 515, 485, 505,   492, 512, 482, 502],
        ['OTU015', 'Bacteria;Acidobacteria;Acidobacteriae',
          462, 482, 452, 472,   467, 487, 457, 477,   464, 484, 454, 474],
        ['OTU016', 'Bacteria;Acidobacteria;Blastocatellia',
          510, 530, 500, 520,   508, 528, 498, 518,   511, 531, 501, 521],
        // ── Minor phyla ───────────────────────────────────────────────────
        ['OTU017', 'Bacteria;Verrucomicrobia;Verrucomicrobiae',
          350, 280, 410, 320,   450, 380, 520, 390,   300, 420, 340, 460],
        ['OTU018', 'Bacteria;Planctomycetes;Planctomycetia',
          420, 390, 460, 400,   380, 350, 430, 370,   440, 410, 470, 430],
      ],
    },
  ],
}

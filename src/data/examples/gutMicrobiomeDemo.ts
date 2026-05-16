import type { ParsedFile } from '@/types/sheet'

// 12 OTUs × 10 samples — gut microbiome, healthy vs dysbiosis
// Samples 1-5: healthy, 6-10: dysbiosis
// Network shows: Firmicutes + Bacteroidota + Actinobacteria cluster
//   negatively correlated with Proteobacteria cluster
export const gutMicrobiomeDemoExample: ParsedFile = {
  source: 'example',
  fileName: 'gut_microbiome_demo.xlsx',
  sheets: [
    {
      name: 'OTU table',
      rows: [
        [
          'OTU_ID', 'Taxonomy',
          'H1', 'H2', 'H3', 'H4', 'H5',
          'D1', 'D2', 'D3', 'D4', 'D5',
        ],
        // ── Firmicutes (healthy-enriched) ─────────────────────────────────
        ['Lactobacillus',    'Bacteria;Firmicutes;Bacilli;Lactobacillales;Lactobacillaceae',
          1200, 1100, 1300, 1050, 1180,   580, 620, 550, 640, 600],
        ['Roseburia',        'Bacteria;Firmicutes;Clostridia;Eubacteriales;Lachnospiraceae',
          1050,  980, 1120,  920, 1080,   480, 520, 450, 560, 500],
        ['Faecalibacterium', 'Bacteria;Firmicutes;Clostridia;Eubacteriales;Ruminococcaceae',
           950,  900, 1020,  850,  980,   440, 480, 410, 500, 460],
        ['Blautia',          'Bacteria;Firmicutes;Clostridia;Eubacteriales;Lachnospiraceae',
           800,  750,  870,  720,  830,   380, 420, 350, 440, 400],
        // ── Bacteroidota (healthy-enriched) ───────────────────────────────
        ['Bacteroides',  'Bacteria;Bacteroidota;Bacteroidia;Bacteroidales;Bacteroidaceae',
          1100, 1020, 1180,  980, 1120,   490, 530, 460, 550, 510],
        ['Prevotella',   'Bacteria;Bacteroidota;Bacteroidia;Bacteroidales;Prevotellaceae',
           900,  840,  960,  810,  920,   410, 450, 380, 470, 430],
        ['Alistipes',    'Bacteria;Bacteroidota;Bacteroidia;Bacteroidales;Rikenellaceae',
           750,  700,  810,  680,  770,   350, 390, 320, 410, 370],
        // ── Actinobacteria (healthy-enriched) ─────────────────────────────
        ['Bifidobacterium', 'Bacteria;Actinobacteria;Actinomycetia;Bifidobacteriales;Bifidobacteriaceae',
           620,  580,  660,  540,  640,   290, 330, 260, 350, 310],
        ['Eggerthella',     'Bacteria;Actinobacteria;Coriobacteriia;Coriobacteriales;Eggerthellaceae',
           450,  420,  480,  400,  460,   210, 240, 190, 260, 220],
        // ── Proteobacteria (dysbiosis-enriched) ───────────────────────────
        ['Escherichia',  'Bacteria;Proteobacteria;Gammaproteobacteria;Enterobacterales;Enterobacteriaceae',
           280,  310,  260,  330,  290,   650, 610, 680, 590, 640],
        ['Klebsiella',   'Bacteria;Proteobacteria;Gammaproteobacteria;Enterobacterales;Enterobacteriaceae',
           250,  270,  230,  290,  260,   610, 570, 640, 550, 600],
        // ── Verrucomicrobiota (stable) ────────────────────────────────────
        ['Akkermansia',  'Bacteria;Verrucomicrobiota;Verrucomicrobiae;Verrucomicrobiales;Akkermansiaceae',
           380,  420,  340,  450,  390,   360, 400, 320, 440, 370],
      ],
    },
  ],
}

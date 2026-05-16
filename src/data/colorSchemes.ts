import type { ColorScheme } from '@/types/params'

export type Colorscale = Array<[number, string]>

export const colorScales: Record<ColorScheme, Colorscale> = {
  red_blue: [
    [0, '#2166AC'],
    [0.25, '#67A9CF'],
    [0.5, '#F7F7F7'],
    [0.75, '#EF8A62'],
    [1, '#B2182B'],
  ],
  white_red: [
    [0, '#FFFFFF'],
    [0.5, '#FCAE91'],
    [1, '#A50F15'],
  ],
  viridis: [
    [0, '#440154'],
    [0.25, '#3B528B'],
    [0.5, '#21908C'],
    [0.75, '#5DC863'],
    [1, '#FDE725'],
  ],
  magma: [
    [0, '#000004'],
    [0.25, '#3B0F70'],
    [0.5, '#8C2981'],
    [0.75, '#DE4968'],
    [1, '#FCFDBF'],
  ],
  green_yellow: [
    [0, '#1A9850'],
    [0.5, '#FFFFBF'],
    [1, '#FDAE61'],
  ],
}

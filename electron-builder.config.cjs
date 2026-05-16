/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  appId: 'com.bintools.app',
  productName: 'BinTools',
  copyright: 'Copyright © 2026 Hear1t',

  directories: {
    output: 'release',
    buildResources: 'build',
  },

  files: [
    'dist/**/*',
    'dist-electron/**/*',
    'package.json',
  ],

  // macOS
  mac: {
    target: [
      { target: 'dmg', arch: ['arm64', 'x64'] },
    ],
    category: 'public.app-category.education',
    // No code signing for local distribution (MVP)
    identity: null,
  },
  dmg: {
    sign: false,
    contents: [
      { x: 130, y: 220, type: 'file' },
      { x: 410, y: 220, type: 'link', path: '/Applications' },
    ],
  },

  // Windows
  win: {
    target: [
      { target: 'nsis', arch: ['x64'] },
    ],
  },
  nsis: {
    oneClick: true,
    perMachine: false,
    deleteAppDataOnUninstall: false,
  },
}

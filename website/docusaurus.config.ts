import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Trust HR Portal',
  tagline: 'Enterprise HR Operations Management',
  favicon: 'img/favicon.ico',

  url: 'https://shashank-mugiwara.github.io',
  baseUrl: '/hrops/',

  organizationName: 'shashank-mugiwara',
  projectName: 'hrops',

  onBrokenLinks: 'throw',
  markdown: {
    format: 'mdx',
    mermaid: true,
    preprocessor: ({filePath, fileContent}) => {
      return fileContent;
    },
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/shashank-mugiwara/hrops/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Trust HR',
      logo: {
        alt: 'Trust HR Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/shashank-mugiwara/hrops',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'PRD',
              to: '/docs/prd',
            },
            {
              label: 'Technical Docs',
              to: '/docs/technical/overview',
            },
            {
              label: 'Functional Docs',
              to: '/docs/functional/overview',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/shashank-mugiwara/hrops',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Trust HR Portal. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

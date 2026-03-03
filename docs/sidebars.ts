import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'prd',
    {
      type: 'category',
      label: 'Technical Documentation',
      items: [
        'technical/overview',
        'technical/components',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Functional Documentation',
      items: [
        'functional/overview',
      ],
      collapsed: false,
    },
  ],
};

export default sidebars;

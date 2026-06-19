import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '系统设计',
      items: [
        'panda-next-panda-php/overview',
        'panda-next-panda-php/architecture',
      ],
    },
    {
      type: 'category',
      label: '业务设计',
      items: [
        'panda-next-panda-php/modules',
        'panda-next-panda-php/modules/user-and-permission',
        'panda-next-panda-php/modules/torrent-and-tracker',
        'panda-next-panda-php/modules/community-and-operation',
        'panda-next-panda-php/modules/admin-and-ops',
        'panda-next-panda-php/modules/database-and-storage',
        'panda-next-panda-php/data-model',
      ],
    },
    {
      type: 'category',
      label: '接口与运维',
      items: [
        'panda-next-panda-php/api-and-ops',
      ],
    },
  ],
  databaseSidebar: [
    {
      type: 'category',
      label: '数据库设计',
      items: [
        'database-design/overview',
        {
          type: 'category',
          label: '表级现状',
          items: [
            {
              type: 'category',
              label: '用户模块',
              items: [
                {
                  type: 'doc',
                  id: 'database-design/tables/users',
                  label: '用户主表[users]',
                },
              ],
            },
            {
              type: 'category',
              label: '种子模块',
              items: [
                {
                  type: 'doc',
                  id: 'database-design/tables/torrents',
                  label: '种子主表[torrents]',
                },
              ],
            },
            {
              type: 'category',
              label: 'Tracker模块',
              items: [
                {
                  type: 'doc',
                  id: 'database-design/tables/peers',
                  label: '连接状态表[peers]',
                },
                {
                  type: 'doc',
                  id: 'database-design/tables/snatched',
                  label: '完成记录表[snatched]',
                },
              ],
            },
            {
              type: 'category',
              label: '系统模块',
              items: [
                {
                  type: 'doc',
                  id: 'database-design/tables/settings',
                  label: '配置表[settings]',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '模块实体',
          items: [
            'database-design/entities/user',
            'database-design/entities/torrent',
            'database-design/entities/peer',
            'database-design/entities/snatch',
            'database-design/entities/community',
            'database-design/entities/comment',
            'database-design/entities/message',
            'database-design/entities/operation',
            'database-design/entities/exam',
            'database-design/entities/hit-and-run',
            'database-design/entities/medal',
            'database-design/entities/plugin',
            'database-design/entities/system',
            'database-design/entities/legacy',
          ],
        },
        'database-design/domain-model',
        'database-design/table-catalog',
        'database-design/logs-and-indexes',
        'database-design/maintenance',
      ],
    },
  ],
};

export default sidebars;

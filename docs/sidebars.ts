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
        {
          type: 'category',
          label: '账户与权限',
          items: [
            'panda-next-panda-php/modules/user-and-permission',
            'panda-next-panda-php/modules/user/login-and-auth',
            'panda-next-panda-php/modules/user/user-profile',
            'panda-next-panda-php/modules/user/permission-and-level',
            'panda-next-panda-php/modules/user/user-status-governance',
            'panda-next-panda-php/modules/user/invitation-system',
          ],
        },
        {
          type: 'category',
          label: '种子与 Tracker',
          items: [
            'panda-next-panda-php/modules/torrent-and-tracker',
            'panda-next-panda-php/modules/torrent/torrent-list-detail',
            'panda-next-panda-php/modules/torrent/torrent-publish-edit',
            'panda-next-panda-php/modules/torrent/torrent-approval',
            'panda-next-panda-php/modules/torrent/torrent-search-filter',
            'panda-next-panda-php/modules/torrent/file-download-contract',
            'panda-next-panda-php/modules/torrent/peer-snatch-query',
            'panda-next-panda-php/modules/torrent/tracker-announce',
            'panda-next-panda-php/modules/torrent/tracker-scrape-peer-snatch',
          ],
        },
        {
          type: 'category',
          label: '社区与运营',
          items: [
            'panda-next-panda-php/modules/community-and-operation',
            'panda-next-panda-php/modules/community/news-and-polls',
            'panda-next-panda-php/modules/community/messages-and-notifications',
            'panda-next-panda-php/modules/community/comments-thanks-bookmarks',
            'panda-next-panda-php/modules/community/attendance-signin',
            'panda-next-panda-php/modules/community/rewards-and-medals',
            'panda-next-panda-php/modules/community/reward-notification-contract',
            'panda-next-panda-php/modules/community/comment-governance-and-moderation',
            'panda-next-panda-php/modules/community/exams-and-hit-and-run',
            'panda-next-panda-php/modules/community/requests-claims-and-reports',
          ],
        },
        {
          type: 'category',
          label: '后台与治理',
          items: [
            'panda-next-panda-php/modules/admin-and-ops',
            'panda-next-panda-php/modules/admin/settings-center',
            'panda-next-panda-php/modules/admin/user-governance-backoffice',
            'panda-next-panda-php/modules/admin/client-risk-control',
            'panda-next-panda-php/modules/admin/operations-resources',
            'panda-next-panda-php/modules/admin/admin-operation-contract',
            'panda-next-panda-php/modules/admin/search-index-sync',
            'panda-next-panda-php/modules/admin/logs-audit-query',
            'panda-next-panda-php/modules/admin/dashboard-and-statistics',
          ],
        },
        {
          type: 'category',
          label: '数据库与存储',
          items: [
            'panda-next-panda-php/modules/database-and-storage',
            'panda-next-panda-php/modules/storage/business-data-storage',
            'panda-next-panda-php/modules/storage/tracker-runtime-storage',
            'panda-next-panda-php/modules/storage/content-and-audit-storage',
            'panda-next-panda-php/modules/storage/file-and-backup-storage',
          ],
        },
        'panda-next-panda-php/data-model',
      ],
    },
        {
          type: 'category',
          label: '接入与运维',
          items: [
            'panda-next-panda-php/api-and-ops',
            'panda-next-panda-php/modules/integration/site-entry-and-home',
            'panda-next-panda-php/modules/integration/third-party-approval',
            'panda-next-panda-php/modules/integration/external-user-lookup',
          ],
        },
  ],
  databaseSidebar: [
    {
      type: 'category',
      label: '用户模块',
      items: [
        {
          type: 'doc',
          id: 'database-design/tables/user/allowedemails',
          label: '允许邮箱表[allowedemails]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/bannedemails',
          label: '禁用邮箱表[bannedemails]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/friends',
          label: '好友关系表[friends]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/invites',
          label: '邀请表[invites]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/login_logs',
          label: '登录日志表[login_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/personal_access_tokens',
          label: '访问令牌表[personal_access_tokens]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/user_ban_logs',
          label: '用户封禁日志表[user_ban_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/user_metas',
          label: '用户扩展表[user_metas]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/username_change_logs',
          label: '用户名变更日志表[username_change_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/user/users',
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
          id: 'database-design/tables/torrent/attachments',
          label: '附件表[attachments]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/audiocodecs',
          label: '音频编码表[audiocodecs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/categories',
          label: '分类表[categories]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/caticons',
          label: '分类图标表[caticons]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/codecs',
          label: '视频编码表[codecs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/files',
          label: '文件表[files]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/media',
          label: '媒介表[media]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/processings',
          label: '处理方式表[processings]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/searchbox',
          label: '搜索配置表[searchbox]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/searchbox_fields',
          label: '搜索字段表[searchbox_fields]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/secondicons',
          label: '次图标表[secondicons]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/sources',
          label: '来源表[sources]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/standards',
          label: '规格表[standards]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/subs',
          label: '字幕表[subs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/tags',
          label: '标签表[tags]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/teams',
          label: '制作组表[teams]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrent_buy_logs',
          label: '种子购买日志表[torrent_buy_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrent_deny_reasons',
          label: '种子拒绝原因表[torrent_deny_reasons]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrent_operation_logs',
          label: '种子操作日志表[torrent_operation_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrent_secrets',
          label: '种子密钥表[torrent_secrets]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrent_tags',
          label: '种子标签关系表[torrent_tags]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrents',
          label: '种子主表[torrents]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrents_custom_field_values',
          label: '种子自定义字段值表[torrents_custom_field_values]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrents_custom_fields',
          label: '种子自定义字段表[torrents_custom_fields]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/torrent/torrents_state',
          label: '种子状态表[torrents_state]',
        },
      ],
    },
    {
      type: 'category',
      label: 'Tracker模块',
      items: [
        {
          type: 'doc',
          id: 'database-design/tables/tracker/peers',
          label: '连接状态表[peers]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/tracker/snatched',
          label: '完成记录表[snatched]',
        },
      ],
    },
    {
      type: 'category',
      label: '社区模块',
      items: [
        {
          type: 'doc',
          id: 'database-design/tables/community/bookmarks',
          label: '书签表[bookmarks]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/comments',
          label: '评论表[comments]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/forummods',
          label: '版主关系表[forummods]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/forums',
          label: '论坛版块表[forums]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/messages',
          label: '站内信表[messages]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/news',
          label: '新闻表[news]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/overforums',
          label: '上级论坛表[overforums]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/pmboxes',
          label: '私信盒子表[pmboxes]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/pollanswers',
          label: '投票选项表[pollanswers]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/polls',
          label: '投票表[polls]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/posts',
          label: '帖子表[posts]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/readposts',
          label: '已读帖子表[readposts]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/shoutbox',
          label: '喊话箱表[shoutbox]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/staffmessages',
          label: '管理消息表[staffmessages]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/thanks',
          label: '感谢表[thanks]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/community/topics',
          label: '主题表[topics]',
        },
      ],
    },
    {
      type: 'category',
      label: '运营模块',
      items: [
        {
          type: 'doc',
          id: 'database-design/tables/operation/attendance',
          label: '签到表[attendance]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/attendance_logs',
          label: '签到日志表[attendance_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/bonus_logs',
          label: '积分日志表[bonus_logs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/cheaters',
          label: '作弊记录表[cheaters]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/claims',
          label: '认领表[claims]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/complain_replies',
          label: '申诉回复表[complain_replies]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/complains',
          label: '申诉表[complains]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/exam_progress',
          label: '考核进度表[exam_progress]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/exam_users',
          label: '考核用户表[exam_users]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/exams',
          label: '考核表[exams]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/fun',
          label: '趣味项表[fun]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/funds',
          label: '资金表[funds]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/funvotes',
          label: '趣味投票表[funvotes]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/hit_and_runs',
          label: 'H&R表[hit_and_runs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/magic',
          label: '魔法道具表[magic]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/medals',
          label: '勋章表[medals]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/offers',
          label: '候选表[offers]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/offervotes',
          label: '候选投票表[offervotes]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/reports',
          label: '举报表[reports]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/requests',
          label: '求种表[requests]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/resreq',
          label: '资源请求关系表[resreq]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/seed_box_records',
          label: 'SeedBox记录表[seed_box_records]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/suggest',
          label: '建议表[suggest]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/operation/user_medals',
          label: '用户勋章表[user_medals]',
        },
      ],
    },
    {
      type: 'category',
      label: '系统模块',
      items: [
        {
          type: 'doc',
          id: 'database-design/tables/system/adclicks',
          label: '广告点击表[adclicks]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/adminpanel',
          label: '管理面板表[adminpanel]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/advertisements',
          label: '广告表[advertisements]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/agent_allowed_exception',
          label: '客户端白名单例外表[agent_allowed_exception]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/agent_allowed_family',
          label: '客户端白名单家族表[agent_allowed_family]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/avps',
          label: 'AVPS表[avps]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/bans',
          label: '封禁表[bans]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/bitbucket',
          label: '回收站表[bitbucket]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/blocks',
          label: '屏蔽关系表[blocks]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/chronicle',
          label: '编年史表[chronicle]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/countries',
          label: '国家表[countries]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/downloadspeed',
          label: '下载速度档位表[downloadspeed]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/failed_jobs',
          label: '失败任务表[failed_jobs]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/faq',
          label: 'FAQ表[faq]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/iplog',
          label: 'IP日志表[iplog]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/isp',
          label: 'ISP表[isp]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/language',
          label: '语言表[language]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/links',
          label: '链接表[links]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/locations',
          label: '地区表[locations]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/loginattempts',
          label: '登录尝试表[loginattempts]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/modpanel',
          label: '版主面板表[modpanel]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/plugins',
          label: '插件表[plugins]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/prolinkclicks',
          label: '推广点击表[prolinkclicks]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/regimages',
          label: '验证码表[regimages]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/rules',
          label: '规则表[rules]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/schools',
          label: '学校表[schools]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/settings',
          label: '配置表[settings]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/sitelog',
          label: '站点日志表[sitelog]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/stylesheets',
          label: '样式表[stylesheets]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/sysoppanel',
          label: '系统管理面板表[sysoppanel]',
        },
        {
          type: 'doc',
          id: 'database-design/tables/system/uploadspeed',
          label: '上传速度档位表[uploadspeed]',
        },
      ],
    },
  ],
};

export default sidebars;

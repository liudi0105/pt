# 配置参考

本文档列出配置中心所有配置分组及其键值说明。配置采用 `{group}.{key}` 点号命名法，存储在 `settings` 表中。

---

## Filament Tab 管理分组

以下分组在管理后台 System > Setting 以 Tab 页面管理。

### `hr`

H&R（Hit and Run）考核规则配置。管理入口：Filament Tab「H&R」。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `mode` | `disabled` | H&R 模式：`disabled`（禁用）/ `manual`（手动）/ `global`（全局） |
| `inspect_time` | `""` | 考核窗口时长，从下载完成开始计算，单位：小时 |
| `seed_time_minimum` | `""` | 达标最短做种时长，单位：小时，必须小于 `inspect_time` |
| `ignore_when_ratio_reach` | `""` | 达标分享率阈值，达到该分享率可自动豁免 H&R |
| `ban_user_when_counts_reach` | `""` | H&R 数量达到此值时自动封禁账号 |
| `include_rate` | `1` | 下载完成率阈值（0~1 之间的小数），只有完成率达到此值才计入 H&R |

### `backup`

自动备份配置。管理入口：Filament Tab「Backup」。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `enabled` | `no` | 是否启用自动备份 |
| `frequency` | `daily` | 备份频率：`daily`（每日）/ `hourly`（每小时） |
| `hour` | `0` | 备份执行的小时（0-23） |
| `minute` | `0` | 备份执行的分钟。若频率为 `hourly` 则忽略此值 |
| `google_drive_client_id` | `""` | Google Drive API 客户端 ID |
| `google_drive_client_secret` | `""` | Google Drive API 客户端密钥 |
| `google_drive_refresh_token` | `""` | Google Drive 刷新令牌 |
| `google_drive_folder_id` | `""` | Google Drive 目标文件夹 ID |
| `via_ftp` | `no` | 是否通过 FTP 保存备份（FTP 配置在 `.env` 文件中设置） |
| `via_sftp` | `no` | 是否通过 SFTP 保存备份（SFTP 配置在 `.env` 文件中设置） |

### `seed_box`

SeedBox（盒子）检测与规则配置。管理入口：Filament Tab「SeedBox」。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `enabled` | `no` | 是否启用 SeedBox 规则 |
| `no_promotion` | `yes` | 是否对 SeedBox 流量不启用促销（上传/下载按实计算） |
| `max_uploaded` | `3` | 最大上传量倍数。总上传量最多为其体积的此倍数，设为 0 无限制 |
| `not_seed_box_max_speed` | `10240` | 非 SeedBox 最大上传速度，单位：Mbps。超过此值且无法匹配 SeedBox 记录时禁用下载权限 |
| `max_uploaded_duration` | `0` | 最大上传量倍数的有效时间范围，单位：小时。种子发布后在此时间内有效，超出后不再适用。0 表示始终有效 |

### `meilisearch`

MeiliSearch 搜索引擎配置。管理入口：Filament Tab「Meilisearch」。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `enabled` | `no` | 是否启用 MeiliSearch。启用前需先安装配置并导入数据 |
| `search_description` | `no` | 是否同时搜索种子描述。切换后需重新导入数据 |
| `default_search_mode` | `exact` | 默认搜索模式：`exact`（精确匹配，不分词）/ `and`（AND 分词搜索） |

### `system`

系统常规配置。管理入口：Filament Tab「System」。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `change_username_min_interval_in_days` | `365` | 改名卡最低间隔天数 |
| `change_username_card_allow_characters_outside_the_alphabets` | `no` | 改名卡是否允许非英文字符 |
| `maximum_number_of_medals_can_be_worn` | `3` | 用户最多可佩戴勋章数量 |
| `cookie_valid_days` | `365` | Cookie 有效天数 |
| `maximum_upload_speed` | `8000` | 最大上传速度（Mbps）。用于作弊检测：实际速度上限 = 此值 / 检测等级（保守=1 到 可疑=4） |
| `is_invite_pre_email_and_username` | `yes` | 邀请时是否预占邮箱和用户名。预占后用户注册时不可更改 |
| `access_admin_class_min` | `ADMIN` | 可登录管理后台的最低用户等级 |

---

## 传统 settings.php 管理分组

以下分组在传统 `/settings.php` 页面以区块形式管理。

### `basic`

站点基础身份标识。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `SITENAME` | `NexusPHP` | 站点名称，显示在前台各页面标题栏 |
| `BASEURL` | `""` | 站点基础 URL，无尾部斜杠 |
| `announce_url` | `""` | Tracker announce 地址 |

### `main`

核心运行参数，覆盖站点开关、Tracker 间隔、注册策略、界面展示等 50+ 项配置。

**站点状态：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `site_online` | `yes` | 站点是否在线。设为 `no` 时仅管理员可访问 |
| `maxusers` | `50000` | 最大注册用户数 |
| `registration` | `yes` | 是否开放自由注册 |
| `invitesystem` | `no` | 是否启用邀请系统 |
| `signup_timeout` | `259200` | 未确认注册的过期时间（秒），默认 3 天 |
| `invite_count` | `0` | 新用户初始邀请数量 |
| `invite_timeout` | `7` | 邀请码有效天数 |
| `tmp_invite_count` | `0` | 初始临时邀请数量 |
| `verification` | `automatic` | 用户验证方式：`automatic`（自动）/ `email`（邮箱）/ `admin`（管理员） |

**Tracker 间隔：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `announce_interval` | `1800` | 默认 announce 间隔（秒） |
| `annintertwoage` | `7` | 第二天区间生效天数 |
| `annintertwo` | `2700` | 第二 announce 间隔（秒），45 分钟 |
| `anninterthreeage` | `30` | 第三区间生效天数 |
| `anninterthree` | `3600` | 第三 announce 间隔（秒），60 分钟 |

**种子与上传：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `max_torrent_size` | `1048576` | 最大种子文件大小（字节），默认 1MB |
| `torrent_dir` | `torrents` | 种子文件存储目录 |
| `torrentsperpage` | `50` | 每页种子数量 |
| `iniupload` | `0` | 新用户初始上传量（字节） |
| `maxsubsize` | `3145728` | 最大字幕文件大小（字节），默认 3MB |
| `torrentnameprefix` | `[Nexus]` | 下载种子文件名的前缀 |
| `browsecat` | `4` | 种子浏览区的分类模式 |
| `specialcat` | `4` | Special 区的分类模式 |

**Offer 系统：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `showoffer` | `yes` | 是否启用 Offer 模块 |
| `minoffervotes` | `15` | Offer 通过所需最少投票数 |
| `offervotetimeout` | `259200` | Offer 投票超时时间（秒），默认 72 小时 |
| `offeruptimeout` | `86400` | Offer 上传超时时间（秒），默认 24 小时 |
| `offer_skip_approved_count` | `5` | 自动通过的 Offer 数量阈值，超过后需人工审核 |

**界面展示：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `postsperpage` | `10` | 每页帖子数 |
| `topicsperpage` | `20` | 每页主题数 |
| `maxnewsnum` | `3` | 首页新闻显示条数 |
| `showhotmovies` | `no` | 首页是否显示热门资源 |
| `showclassicmovies` | `no` | 首页是否显示经典资源 |
| `showimdbinfo` | `no` | 是否全局启用 IMDb 信息 |
| `enablenfo` | `yes` | 是否启用 NFO 显示 |
| `showpolls` | `yes` | 是否显示投票 |
| `showstats` | `yes` | 是否显示站点统计 |
| `showlastxtorrents` | `no` | 首页是否显示最新 X 个种子 |
| `showtrackerload` | `yes` | 是否显示服务器负载 |
| `showshoutbox` | `yes` | 是否显示 shoutbox |
| `showfunbox` | `no` | 是否显示 funbox |
| `showhelpbox` | `no` | 是否显示 helpbox |
| `showforumstats` | `yes` | 论坛页面是否显示统计 |
| `showlastxforumposts` | `no` | 首页是否显示最新 X 个论坛帖子 |
| `show_top_uploader` | `no` | 是否显示上传者排行榜 |
| `smalldescription` | `yes` | 种子标题下是否显示小描述 |
| `altname` | `no` | 是否使用 PTShow 命名风格 |
| `logo` | `""` | 站点 Logo 图片 URL |
| `SLOGAN` | `The Ultimate File Sharing Experience` | 站点标语 |
| `defaultlang` | `en` | 默认语言 |
| `site_language_enabled` | `1` | 是否启用多语言支持 |
| `imdb_language` | `en-US` | IMDb 语言偏好 |
| `defstylesheet` | `3` | 新用户默认样式表 |

**自动清理：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `autoclean_interval_one` | `3600` | 自动清理优先级 1（秒），默认 60 分钟 |
| `autoclean_interval_two` | `5400` | 自动清理优先级 2（秒），默认 90 分钟 |
| `autoclean_interval_three` | `7200` | 自动清理优先级 3（秒），默认 2 小时 |
| `autoclean_interval_four` | `86400` | 自动清理优先级 4（秒），默认 24 小时 |
| `autoclean_interval_five` | `1296000` | 自动清理优先级 5（秒），默认 15 天 |

**其他：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `max_dead_torrent_time` | `21600` | 种子标记为死种的时间阈值（秒），默认 6 小时 |
| `SITEEMAIL` | `nobody@gmail.com` | 站点联系邮箱 |
| `ACCOUNTANTID` | `1` | 财务/会计用户 ID（用于捐赠） |
| `ALIPAYACCOUNT` | `""` | 支付宝捐赠账号 |
| `PAYPALACCOUNT` | `""` | PayPal 捐赠账号 |
| `reportemail` | `nobody@gmail.com` | 举报接收邮箱 |
| `icplicense` | `""` | ICP 备案号 |
| `sptime` | `no` | 周末是否免费上传 |
| `enablebitbucket` | `yes` | 是否启用头像 bitbucket |
| `extforum` | `no` | 是否使用外部论坛 |
| `extforumurl` | `http://www.cc98.org` | 外部论坛 URL |
| `donation` | `yes` | 是否启用捐赠系统 |
| `enableschool` | `no` | 是否启用学校系统（请勿启用） |
| `spsct` | `no` | 是否启用特殊版块（请勿随意启用） |
| `restrictemail` | `no` | 是否限制邮箱域名 |
| `waitsystem` | `no` | 是否启用等待系统 |
| `maxdlsystem` | `no` | 是否启用最大并发下载系统 |
| `bitbucket` | `bitbucket` | Bitbucket 目录名 |
| `enable_pt_gen_system` | `no` | 是否启用 PT-Gen 系统 |
| `pt_gen_api_point` | `""` | PT-Gen API 端点 |
| `enable_technical_info` | `no` | 是否启用种子技术信息 |
| `enable_global_search` | `yes` | 是否启用全局搜索 |
| `upload_deny_approval_deny_count` | `2` | 上传被拒后自动审核通过所需次数 |
| `seeding_leeching_time_calc_start` | `""` | 旧版字段，做种/下载时间计算起点 |
| `startsubid` | `NULL` | 旧版字段 |

### `smtp`

邮件发送配置。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `smtptype` | `advanced` | SMTP 类型：`default`（默认）/ `advanced`（高级）/ `external`（外部） |
| `emailnotify` | `no` | 是否启用邮件通知 |
| `smtp_host` | `localhost` | SMTP 主机 |
| `smtp_port` | `233` | SMTP 端口 |
| `smtp_from` | `NULL` | 发件人地址 |
| `smtpaddress` | `smtp.qq.com` | 外部 SMTP 服务器地址 |
| `smtpport` | `25` | 外部 SMTP 端口 |
| `encryption` | `ssl` | SMTP 加密方式：`ssl` / `tls` |
| `accountname` | `""` | SMTP 账号名 |
| `accountpassword` | `""` | SMTP 账号密码 |

### `security`

安全与登录策略配置。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `securelogin` | `no` | Web 是否使用 SSL |
| `securetracker` | `no` | Tracker 是否使用 SSL |
| `https_announce_url` | `""` | HTTPS announce URL |
| `iv` | `yes` | 是否启用图像验证码 |
| `maxip` | `2` | 同一 IP 最大注册数 |
| `maxloginattempts` | `10` | 登录尝试次数限制，超过后 IP 被封 |
| `changeemail` | `no` | 是否允许用户自助修改邮箱 |
| `cheaterdet` | `1` | 作弊检测等级（1-4）：1=保守，4=可疑 |
| `nodetect` | `11` | 用户等级 >= 此值时不进行作弊检测 |
| `guest_visit_type` | `normal` | 访客访问模式：`normal`（正常）/ `static_page`（静态页）/ `custom_content`（自定义内容）/ `redirect`（重定向） |
| `guest_visit_value_static_page` | `beian-aliyun.html` | 访客静态页面文件名 |
| `guest_visit_value_custom_content` | `[em24]` | 访客自定义内容 |
| `guest_visit_value_redirect` | `https://nexusphp.org/` | 访客重定向 URL |
| `login_type` | `normal` | 登录方式 |
| `login_secret_lifetime` | `10` | 登录密钥有效期 |
| `login_secret_deadline` | `2021-02-03 18:55:46` | 登录密钥截止时间 |
| `login_secret` | `8e19c6a796602bda113fb2f5bc9da2b0` | 登录密钥 |

### `authority`

权限映射，定义每种操作所需的最低用户等级。共 40+ 项。

| 键 | 默认值（等级） | 说明 |
|---|--------------|------|
| `defaultclass` | `1`（Peasant） | 注册时的默认等级 |
| `staffmem` | `13`（Administrator） | 工作人员最低等级 |
| `upload` | `2`（User） | 上传种子所需等级 |
| `uploadspecial` | `12`（Uploader） | 上传特殊种子所需等级 |
| `sendinvite` | `2`（User） | 发送邀请所需等级 |
| `buyinvite` | `5`（PowerUser） | 购买邀请所需等级 |
| `askreseed` | `2`（User） | 请求补种所需等级 |
| `viewnfo` | `2`（User） | 查看 NFO 所需等级 |
| `viewuserlist` | `2`（User） | 查看用户列表所需等级 |
| `topten` | `2`（User） | 查看排行榜所需等级 |
| `torrenthistory` | `2`（User） | 查看种子历史所需等级 |
| `userbar` | `2`（User） | 使用用户条所需等级 |
| `beanonymous` | `4`（PowerUser） | 匿名发布所需等级 |
| `view_special_torrent` | `4`（PowerUser） | 查看特殊种子所需等级 |
| `log` | `5`（Elite User） | 查看日志所需等级 |
| `viewhistory` | `6`（Crazy User） | 查看历史所需等级 |
| `torrentstructure` | `8`（Veteran User） | 种子结构管理所需等级 |
| `updateextinfo` | `7`（Insane User） | 更新扩展信息所需等级 |
| `torrentmanage` | `13`（Administrator） | 种子管理所需等级 |
| `torrent-approval` | `14`（Sysop） | 种子审核所需等级 |
| `torrent-delete` | `14`（Sysop） | 删除种子所需等级 |
| `torrent_hr` | `14`（Sysop） | 设置种子 H&R 所需等级 |
| `torrent-sticky` | `14`（Sysop） | 置顶种子所需等级 |
| `torrent-set-special-tag` | `14`（Sysop） | 设置特殊标签所需等级 |
| `torrent-set-price` | `12`（Uploader） | 设置种子价格所需等级 |
| `torrent-approval-allow-automatic` | `12`（Uploader） | 自动审核种子所需等级 |
| `torrentonpromotion` | `0`（Peasant） | 种子促销操作所需等级 |
| `user-delete` | `14`（Sysop） | 删除用户所需等级 |
| `user-change-class` | `14`（Sysop） | 变更用户等级所需等级 |
| `userprofile` | `14`（Sysop） | 查看用户完整资料所需等级 |
| `viewanonymous` | `12`（Uploader） | 查看匿名发布者所需等级 |
| `viewinvite` | `13`（Administrator） | 查看邀请信息所需等级 |
| `seebanned` | `12`（Uploader） | 查看被封用户所需等级 |
| `newsmanage` | `14`（Sysop） | 新闻管理所需等级 |
| `newfunitem` | `1`（Peasant） | 新增 funbox 条目所需等级 |
| `funmanage` | `13`（Administrator） | Funbox 管理所需等级 |
| `sbmanage` | `13`（Administrator） | Shoutbox 管理所需等级 |
| `pollmanage` | `14`（Sysop） | 投票管理所需等级 |
| `applylink` | `1`（Peasant） | 申请友情链接所需等级 |
| `linkmanage` | `14`（Sysop） | 链接管理所需等级 |
| `postmanage` | `13`（Administrator） | 帖子管理所需等级 |
| `commanage` | `13`（Administrator） | 评论管理所需等级 |
| `forummanage` | `14`（Sysop） | 论坛管理所需等级 |
| `prfmanage` | `13`（Administrator） | 个人信息管理所需等级 |
| `cruprfmanage` | `14`（Sysop） | 关键个人信息管理所需等级 |
| `uploadsub` | `1`（Peasant） | 上传字幕所需等级 |
| `delownsub` | `2`（User） | 删除自己的字幕所需等级 |
| `submanage` | `13`（Administrator） | 字幕管理所需等级 |
| `addoffer` | `0`（Peasant） | 添加 Offer 所需等级 |
| `offermanage` | `13`（Administrator） | Offer 管理所需等级 |
| `movetorrent` | `13`（Administrator） | 移动种子所需等级 |
| `chrmanage` | `13`（Administrator） | 作弊记录管理所需等级 |
| `confilog` | `13`（Administrator） | 查看配置日志所需等级 |
| `againstoffer` | `1`（Peasant） | 反对 Offer 所需等级 |

### `tweak`

杂项配置。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `bonus` | `enable` | 是否启用积分（Karma Bonus Point）系统 |
| `where` | `no` | 是否启用用户地理位置显示 |
| `iplog1` | `yes` | 是否记录用户 IP |
| `datefounded` | `2010-08-19` | 站点成立日期 |
| `enablelocation` | `yes` | 是否启用地理位置功能 |
| `titlekeywords` | `""` | HTML 标题关键词 |
| `metakeywords` | `""` | HTML meta 关键词 |
| `metadescription` | `""` | HTML meta 描述 |
| `enablesqldebug` | `no` | 是否启用 SQL 调试 |
| `sqldebug` | `13` | 可查看 SQL 调试的最低等级 |
| `cssdate` | `""` | CSS 缓存刷新日期 |
| `enabletooltip` | `yes` | 是否启用 tooltip |
| `prolinkimg` | `pic/prolink.png` | 推广链接示例图片 |
| `analyticscode` | `""` | 网站统计代码（如 Google Analytics） |

### `bonus`

积分（Karma Bonus Point）经济体系配置。

**做种积分公式参数：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `perseeding` | `1` | 每个种子基础做种积分 |
| `maxseeding` | `7` | 参与做种积分计算的种子数上限 |
| `tzero` | `4` | 做种公式 T0 参数 |
| `nzero` | `7` | 做种公式 N0 参数 |
| `bzero` | `100` | 做种公式 B0 参数（每小时做种积分上限） |
| `l` | `300` | 做种公式 L 参数 |
| `harem_addition` | `0` | 后宫加成系数 |
| `official_addition` | `0.5` | 官方种子加分系数 |
| `zero_bonus_factor` | `0.2` | 零积分种子权重系数 |

**行为奖励积分：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `uploadtorrent` | `15` | 发布种子奖励积分 |
| `uploadsubtitle` | `5` | 上传字幕奖励积分 |
| `starttopic` | `2` | 发起论坛主题奖励积分 |
| `makepost` | `1` | 论坛回帖奖励积分 |
| `addcomment` | `1` | 添加评论奖励积分 |
| `pollvote` | `1` | 投票奖励积分 |
| `offervote` | `1` | Offer 投票奖励积分 |
| `funboxvote` | `1` | Funbox 投票奖励积分 |
| `saythanks` | `0.5` | 说谢谢奖励积分 |
| `receivethanks` | `0` | 收到谢谢奖励积分 |
| `funboxreward` | `5` | Funbox 有趣帖子奖励积分 |
| `donortimes` | `2` | 捐赠者做种积分倍数 |

**积分兑换（上传量）：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `onegbupload` | `300` | 兑换 1GB 上传量所需积分 |
| `fivegbupload` | `800` | 兑换 5GB 上传量所需积分 |
| `tengbupload` | `1300` | 兑换 10GB 上传量所需积分 |
| `hundredgbupload` | `10000` | 兑换 100GB 上传量所需积分 |

**积分兑换（下载量）：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `tengbdownload` | `1000` | 兑换 10GB 下载量所需积分 |
| `hundredgbdownload` | `8000` | 兑换 100GB 下载量所需积分 |

**积分兑换（其他）：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `oneinvite` | `1000` | 兑换 1 个邀请所需积分 |
| `one_tmp_invite` | `500` | 兑换 1 个临时邀请所需积分 |
| `customtitle` | `5000` | 兑换自定义头衔所需积分 |
| `vipstatus` | `8000` | 兑换 1 个月 VIP 所需积分 |
| `attendance_card` | `1000` | 购买签到卡所需积分 |
| `cancel_hr` | `10000` | 取消 1 个 H&R 所需积分 |
| `rainbow_id` | `5000` | 购买彩虹 ID（用户名颜色）所需积分 |
| `change_username_card` | `100000` | 购买改名卡所需积分 |

**兑换限制：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `ratiolimit` | `6` | 兑换上传量的最低分享率要求 |
| `dlamountlimit` | `50` | 兑换上传量的最低上传量要求（GB） |

**积分转账：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `bonusgift` | `yes` | 是否允许用户间赠送积分 |
| `basictax` | `4` | 积分赠送固定税 |
| `taxpercentage` | `10` | 积分赠送百分比税 |
| `prolinkpoint` | `1` | 推广链接点击奖励积分 |
| `prolinktime` | `600` | 推广链接奖励冷却时间（秒） |

### `account`

账号升降级与禁用规则配置。

**账号禁用规则：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `neverdelete` | `6` | 等级 >= 此值的账号永不因不活跃而被禁用 |
| `neverdeletepacked` | `3` | 等级 >= 此值的被封存账号永不因不活跃而被禁用 |
| `deletepacked` | `400` | 被封存账号超过此天数不活跃则禁用 |
| `deleteunpacked` | `150` | 未封存账号超过此天数不活跃则禁用 |
| `deletenotransfer` | `60` | 连续此天数无上传/下载流量则禁用 |
| `deletenotransfertwo` | `0` | 注册天数（备选规则） |
| `deletepeasant` | `30` | 超过此天数 Peasant 等级账号被禁用 |
| `destroy_disabled` | `0` | 是否物理删除已禁用账号 |

**等级提升条件（每一等级 4 个参数）：**

使用前缀缩写标识等级：
- `ps` = Peasant → User（降级条件）
- `pu` = PowerUser，`eu` = Elite User，`cu` = Crazy User
- `iu` = Insane User，`vu` = Veteran User
- `exu` = Extreme User，`uu` = Ultimate User
- `nm` = Nexus Master

每组 4 个参数（以 PowerUser 为例）：

| 键 | 默认值 | 说明 |
|---|-------|------|
| `putime` | `4` | 注册至少 X 周 |
| `pudl` | `50` | 上传量至少 X GB |
| `puprratio` | `1.05` | 分享率（上传/下载）至少达到此值 |
| `puderatio` | `0.95` | 分享率（下载/上传）至少达到此值 |

其余等级键名模式：`{前缀}time`（周）、`{前缀}dl`（GB）、`{前缀}prratio`、`{前缀}deratio`。

**Peasant 降级条件（低于 User 的下限）：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `psdlone` | `50` | 下载量低于 X GB 触发 |
| `psratioone` | `0.4` | 分享率低于此值触发 |
| `psdltwo` | `100` | 第二级下载量阈值 |
| `psratiotwo` | `0.5` | 第二级分享率阈值 |
| `psdlthree` | `200` | 第三级下载量阈值 |
| `psratiothree` | `0.6` | 第三级分享率阈值 |
| `psdlfour` | `400` | 第四级下载量阈值 |
| `psratiofour` | `0.7` | 第四级分享率阈值 |
| `psdlfive` | `800` | 第五级下载量阈值 |
| `psratiofive` | `0.8` | 第五级分享率阈值 |

**晋升奖励邀请数：**

键 `getInvitesByPromotion` 为数组映射，键为等级 ID，值为奖励邀请数。默认映射：2=>1, 3=>0, 4=>2, 5=>0, 6=>3, 7=>0, 8=>5, 9=>10。

### `torrent`

种子促销规则与种子认领配置。

**随机促销概率：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `prorules` | `no` | 是否启用自动促销规则 |
| `randomhalfleech` | `5` | 上传种子时触发 50% 下载的几率（%） |
| `randomfree` | `2` | 触发免费下载的几率（%） |
| `randomtwoup` | `2` | 触发 2x 上传的几率（%） |
| `randomtwoupfree` | `1` | 触发 2x 上传 + 免费下载的几率（%） |
| `randomtwouphalfdown` | `0` | 触发 2x 上传 + 50% 下载的几率（%） |
| `randomthirtypercentdown` | `0` | 触发 30% 下载的几率（%） |

**大体积种子促销：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `largesize` | `20` | 大体积种子阈值（GB） |
| `largepro` | `2` | 大体积种子促销类型（2=免费） |

**促销过期时间：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `expirehalfleech` | `150` | 50% 下载促销过期天数 |
| `expirefree` | `60` | 免费下载促销过期天数 |
| `expiretwoup` | `60` | 2x 上传促销过期天数 |
| `expiretwoupfree` | `30` | 2x 上传 + 免费下载促销过期天数 |
| `expiretwouphalfleech` | `30` | 2x 上传 + 50% 下载促销过期天数 |
| `expirethirtypercentleech` | `0` | 30% 下载促销过期天数 |
| `expirenormal` | `0` | 过期后转换的正常类型 |

**促销类型转换目标：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `halfleechbecome` | `1` | 50% 下载到期后转换类型 |
| `freebecome` | `1` | 免费下载到期后转换类型 |
| `twoupbecome` | `1` | 2x 上传到期后转换类型 |
| `twoupfreebecome` | `1` | 2x 上传+免费到期后转换类型 |
| `twouphalfleechbecome` | `1` | 2x 上传+50% 下载到期后转换类型 |
| `thirtypercentleechbecome` | `1` | 30% 下载到期后转换类型 |
| `normalbecome` | `1` | 正常到期后转换类型 |

**自动热种：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `hotdays` | `7` | 自动热种窗口天数 |
| `hotseeder` | `10` | 自动热种做种人数阈值 |
| `minvotes` | `10` | 促销投票最少票数 |

**Uploader 加成：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `uploaderdouble` | `1` | 发布者上传加成倍数 |

**置顶样式：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `sticky_first_level_background_color` | `#89c9e6` | 一级置顶背景色 |
| `sticky_second_level_background_color` | `#aadbf3` | 二级置顶背景色 |

**种子清理：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `deldeadtorrent` | `0` | X 天后删除死种（0=不删除） |

**种子认领系统（Claim）：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `claim_enabled` | `no` | 是否启用种子认领系统 |
| `claim_torrent_ttl` | `30` | 认领有效天数 |
| `claim_torrent_user_counts_up_limit` | `10` | 每个种子最多认领人数 |
| `claim_user_torrent_counts_up_limit` | `1000` | 每用户最多认领种子数 |
| `claim_remove_deduct_user_bonus` | `600` | 移除认领扣除积分 |
| `claim_give_up_deduct_user_bonus` | `400` | 放弃认领扣除积分 |
| `claim_bonus_multiplier` | `1` | 认领种子做种积分加成倍数 |
| `claim_reach_standard_seed_time` | `300` | 认领达标做种时长（小时） |
| `claim_reach_standard_uploaded` | `2` | 认领达标上传量（种子体积倍数） |

**付费种子：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `paid_torrent_enabled` | `yes` | 是否启用付费种子 |
| `tax_factor` | `0.3` | 付费种子税率 |
| `max_price` | `1000000` | 付费种子最高价格 |

**审批与下载：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `download_support_passkey` | `yes` | 下载是否需要 passkey |
| `approval_status_icon_enabled` | `no` | 是否显示种子审核状态图标 |
| `approval_status_none_visible` | `yes` | 用户能否看到未审核种子 |
| `nfo_view_style_default` | `DOS` | NFO 视图默认样式 |

### `attachment`

附件上传系统配置。按 4 个等级（class）定义上传权限，每等级有独立的大小、数量和扩展名限制。

**全局开关：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `enableattach` | `yes` | 是否全局启用附件功能 |

**等级规则（4 组，模式 `class/classone` `count/countone` `size/sizeone` `ext/extone` 等）：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `classone` | `1` | 第一等级最低用户等级 |
| `countone` | `5` | 第一等级每 24 小时最大附件数 |
| `sizeone` | `256` | 第一等级最大附件大小（KB） |
| `extone` | `jpg, jpeg, png, gif` | 第一等级允许的文件扩展名 |
| `classtwo` | `2` | 第二等级最低用户等级 |
| `counttwo` | `10` | 第二等级每 24 小时最大附件数 |
| `sizetwo` | `512` | 第二等级最大附件大小（KB） |
| `exttwo` | `torrent, zip, rar, 7z, gzip, gz` | 第二等级允许的文件扩展名 |
| `classthree` | `5` | 第三等级最低用户等级 |
| `countthree` | `20` | 第三等级每 24 小时最大附件数 |
| `sizethree` | `1024` | 第三等级最大附件大小（KB） |
| `extthree` | `mp3, ogg, oga, flv` | 第三等级允许的文件扩展名 |
| `classfour` | `13` | 第四等级最低用户等级 |
| `countfour` | `500` | 第四等级每 24 小时最大附件数 |
| `sizefour` | `2048` | 第四等级最大附件大小（KB） |
| `extfour` | `doc, xls` | 第四等级允许的文件扩展名 |

**存储路径：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `savedirectory` | `./attachments` | 附件存储目录 |
| `httpdirectory` | `attachments` | 附件 HTTP 访问路径 |
| `savedirectorytype` | `monthdir` | 目录组织方式：`flat`（平铺）/ `monthdir`（按月分目录）/ `daydir`（按天分目录） |

**缩略图：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `thumbnailtype` | `createthumb` | 缩略图生成模式 |
| `thumbquality` | `80` | 缩略图 JPEG 质量 |
| `thumbwidth` | `500` | 缩略图最大宽度（像素） |
| `thumbheight` | `500` | 缩略图最大高度（像素） |
| `altthumbwidth` | `180` | 备用缩略图宽度（像素） |
| `altthumbheight` | `135` | 备用缩略图高度（像素） |

**水印：**

| 键 | 默认值 | 说明 |
|---|-------|------|
| `watermarkpos` | `9` | 水印位置（9=无水印，1-9 对应 9 宫格位置） |
| `watermarkwidth` | `300` | 水印最小图片宽度（像素） |
| `watermarkheight` | `300` | 水印最小图片高度（像素） |
| `watermarkquality` | `85` | 水印 JPEG 质量 |

### `advertisement`

广告系统配置。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `enablead` | `yes` | 是否启用广告 |
| `enablenoad` | `yes` | 是否允许用户关闭广告 |
| `noad` | `12` | 可关闭广告的最低等级 |
| `enablebonusnoad` | `yes` | 是否允许用积分购买去广告 |
| `bonusnoad` | `2` | 可用积分购买去广告的最低等级 |
| `bonusnoadpoint` | `10000` | 购买去广告所需积分 |
| `bonusnoadtime` | `15` | 购买去广告有效天数 |
| `adclickbonus` | `0` | 点击广告奖励积分 |

### `code`

版本信息（只读，一般不修改）。

| 键 | 默认值 | 说明 |
|---|-------|------|
| `mainversion` | `NexusPHP` | 主版本名称 |
| `subversion` | `v1.6.0-beta6` | 子版本号 |
| `releasedate` | `2021-05-08` | 发布日期 |
| `website` | `https://nexusphp.org` | 官方网站 |

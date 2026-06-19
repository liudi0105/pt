import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceRoot = 'D:\\workspace\\panda-next\\panda-php';
const migrationsDir = path.join(sourceRoot, 'database', 'migrations');
const docsRoot = path.join(repoRoot, 'docs');
const tableDocsDir = path.join(docsRoot, 'docs', 'database-design', 'tables');
const sidebarPath = path.join(docsRoot, 'sidebars.ts');

const moduleOrder = [
  '用户模块',
  '种子模块',
  'Tracker模块',
  '社区模块',
  '运营模块',
  '系统模块',
  '其他模块',
];

const moduleDirMap = {
  '用户模块': 'user',
  '种子模块': 'torrent',
  'Tracker模块': 'tracker',
  '社区模块': 'community',
  '运营模块': 'operation',
  '系统模块': 'system',
  '其他模块': 'other',
};

const moduleMap = {
  '用户模块': [
    'users', 'user_metas', 'user_ban_logs', 'username_change_logs', 'login_logs',
    'invites', 'personal_access_tokens', 'allowedemails', 'bannedemails', 'friends',
  ],
  '种子模块': [
    'torrents', 'torrent_secrets', 'torrent_tags', 'torrent_operation_logs', 'torrent_deny_reasons',
    'torrents_custom_fields', 'torrents_custom_field_values', 'torrents_state', 'files', 'attachments',
    'categories', 'audiocodecs', 'codecs', 'media', 'sources', 'standards', 'processings',
    'teams', 'caticons', 'secondicons', 'tags', 'subs', 'torrent_buy_logs', 'searchbox', 'searchbox_fields',
  ],
  'Tracker模块': [
    'peers', 'snatched',
  ],
  '社区模块': [
    'comments', 'messages', 'staffmessages', 'news', 'polls', 'pollanswers', 'bookmarks', 'thanks',
    'posts', 'topics', 'forums', 'forummods', 'pmboxes', 'shoutbox', 'readposts', 'overforums',
  ],
  '运营模块': [
    'attendance', 'attendance_logs', 'exams', 'exam_users', 'exam_progress', 'hit_and_runs',
    'cheaters', 'claims', 'requests', 'offers', 'offervotes', 'medals', 'user_medals',
    'bonus_logs', 'magic', 'funds', 'complains', 'complain_replies', 'seed_box_records',
    'reports', 'resreq', 'suggest', 'fun', 'funvotes',
  ],
  '系统模块': [
    'settings', 'plugins', 'agent_allowed_exception', 'agent_allowed_family', 'downloadspeed',
    'uploadspeed', 'isp', 'language', 'countries', 'locations', 'schools', 'rules', 'stylesheets',
    'links', 'faq', 'advertisements', 'adclicks', 'prolinkclicks', 'blocks', 'bans', 'loginattempts',
    'regimages', 'iplog', 'sitelog', 'chronicle', 'avps', 'adminpanel', 'modpanel', 'sysoppanel',
    'bitbucket', 'failed_jobs',
  ],
};

const tableLabels = {
  users: '用户主表',
  user_metas: '用户扩展表',
  user_ban_logs: '用户封禁日志表',
  username_change_logs: '用户名变更日志表',
  login_logs: '登录日志表',
  invites: '邀请表',
  personal_access_tokens: '访问令牌表',
  allowedemails: '允许邮箱表',
  bannedemails: '禁用邮箱表',
  friends: '好友关系表',
  torrents: '种子主表',
  torrent_secrets: '种子密钥表',
  torrent_tags: '种子标签关系表',
  torrent_operation_logs: '种子操作日志表',
  torrent_deny_reasons: '种子拒绝原因表',
  torrents_custom_fields: '种子自定义字段表',
  torrents_custom_field_values: '种子自定义字段值表',
  torrents_state: '种子状态表',
  files: '文件表',
  attachments: '附件表',
  categories: '分类表',
  audiocodecs: '音频编码表',
  codecs: '视频编码表',
  media: '媒介表',
  sources: '来源表',
  standards: '规格表',
  processings: '处理方式表',
  teams: '制作组表',
  caticons: '分类图标表',
  secondicons: '次图标表',
  tags: '标签表',
  subs: '字幕表',
  torrent_buy_logs: '种子购买日志表',
  searchbox: '搜索配置表',
  searchbox_fields: '搜索字段表',
  peers: '连接状态表',
  snatched: '完成记录表',
  comments: '评论表',
  messages: '站内信表',
  staffmessages: '管理消息表',
  news: '新闻表',
  polls: '投票表',
  pollanswers: '投票选项表',
  bookmarks: '书签表',
  thanks: '感谢表',
  posts: '帖子表',
  topics: '主题表',
  forums: '论坛版块表',
  forummods: '版主关系表',
  pmboxes: '私信盒子表',
  shoutbox: '喊话箱表',
  readposts: '已读帖子表',
  overforums: '上级论坛表',
  attendance: '签到表',
  attendance_logs: '签到日志表',
  exams: '考核表',
  exam_users: '考核用户表',
  exam_progress: '考核进度表',
  hit_and_runs: 'H&R表',
  cheaters: '作弊记录表',
  claims: '认领表',
  requests: '求种表',
  offers: '候选表',
  offervotes: '候选投票表',
  medals: '勋章表',
  user_medals: '用户勋章表',
  bonus_logs: '积分日志表',
  magic: '魔法道具表',
  funds: '资金表',
  complains: '申诉表',
  complain_replies: '申诉回复表',
  seed_box_records: 'SeedBox记录表',
  reports: '举报表',
  resreq: '资源请求关系表',
  suggest: '建议表',
  fun: '趣味项表',
  funvotes: '趣味投票表',
  settings: '配置表',
  plugins: '插件表',
  agent_allowed_exception: '客户端白名单例外表',
  agent_allowed_family: '客户端白名单家族表',
  downloadspeed: '下载速度档位表',
  uploadspeed: '上传速度档位表',
  isp: 'ISP表',
  language: '语言表',
  countries: '国家表',
  locations: '地区表',
  schools: '学校表',
  rules: '规则表',
  stylesheets: '样式表',
  links: '链接表',
  faq: 'FAQ表',
  advertisements: '广告表',
  adclicks: '广告点击表',
  prolinkclicks: '推广点击表',
  blocks: '屏蔽关系表',
  bans: '封禁表',
  loginattempts: '登录尝试表',
  regimages: '验证码表',
  iplog: 'IP日志表',
  sitelog: '站点日志表',
  chronicle: '编年史表',
  avps: 'AVPS表',
  adminpanel: '管理面板表',
  modpanel: '版主面板表',
  sysoppanel: '系统管理面板表',
  bitbucket: '回收站表',
  failed_jobs: '失败任务表',
};

const fieldTypeOverrides = {
  id: 'bigIncrements',
  bigIncrements: 'bigIncrements',
  increments: 'increments',
  mediumIncrements: 'mediumIncrements',
  smallIncrements: 'smallIncrements',
  tinyIncrements: 'tinyIncrements',
  integer: 'integer',
  bigInteger: 'bigInteger',
  mediumInteger: 'mediumInteger',
  smallInteger: 'smallInteger',
  tinyInteger: 'tinyInteger',
  unsignedInteger: 'unsignedInteger',
  unsignedBigInteger: 'unsignedBigInteger',
  unsignedMediumInteger: 'unsignedMediumInteger',
  unsignedSmallInteger: 'unsignedSmallInteger',
  unsignedTinyInteger: 'unsignedTinyInteger',
  float: 'float',
  double: 'double',
  decimal: 'decimal',
  boolean: 'boolean',
  text: 'text',
  mediumText: 'mediumText',
  longText: 'longText',
  string: 'string',
  char: 'char',
  binary: 'binary',
  json: 'json',
  date: 'date',
  dateTime: 'dateTime',
  timestamp: 'timestamp',
  time: 'time',
  year: 'year',
  enum: 'enum',
};

const relationshipHints = [
  ['userid', 'users.id'],
  ['user_id', 'users.id'],
  ['uid', 'users.id'],
  ['invited_by', 'users.id'],
  ['owner', 'users.id'],
  ['sender', 'users.id'],
  ['receiver', 'users.id'],
  ['torrentid', 'torrents.id'],
  ['torrent_id', 'torrents.id'],
  ['topicid', 'topics.id'],
  ['topic_id', 'topics.id'],
  ['postid', 'posts.id'],
  ['post_id', 'posts.id'],
  ['forumid', 'forums.id'],
  ['forum_id', 'forums.id'],
  ['pollid', 'polls.id'],
  ['poll_id', 'polls.id'],
  ['requestid', 'requests.id'],
  ['request_id', 'requests.id'],
  ['offerid', 'offers.id'],
  ['offer_id', 'offers.id'],
  ['commentid', 'comments.id'],
  ['comment_id', 'comments.id'],
  ['medal_id', 'medals.id'],
  ['exam_id', 'exams.id'],
  ['exam_user_id', 'exam_users.id'],
  ['category', 'categories.id'],
  ['category_id', 'categories.id'],
  ['lang', 'language.id'],
  ['country', 'countries.id'],
  ['school', 'schools.id'],
  ['isp', 'isp.id'],
];

const indexMethods = new Set(['index', 'unique', 'primary']);
const dropMethods = new Set(['dropColumn', 'dropIndex', 'dropUnique', 'dropPrimary']);
const specialColumnMethods = new Set(['timestamps', 'rememberToken', 'softDeletes', 'morphs', 'nullableMorphs']);

function main() {
  fs.mkdirSync(tableDocsDir, { recursive: true });

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.php'))
    .sort();

  const schema = new Map();

  for (const fileName of migrationFiles) {
    const fullPath = path.join(migrationsDir, fileName);
    const content = fs.readFileSync(fullPath, 'utf8');
    const upBody = extractMethodBody(content, 'up');
    if (!upBody) {
      continue;
    }
    const dynamicTables = extractDynamicTables(content);
    const blocks = extractSchemaBlocks(upBody);
    for (const block of blocks) {
      const tables = resolveTables(block.tableExpr, dynamicTables);
      for (const tableName of tables) {
        if (!tableName || tableName === 'json' || tableName === 'text_to_mediumtext') {
          continue;
        }
        const table = ensureTable(schema, tableName);
        table.sources.add(fileName);
        table.actions.push({
          migration: fileName,
          action: block.action,
          body: block.body,
        });
      }
    }
  }

  for (const [, table] of schema) {
    for (const action of table.actions) {
      applyBlock(table, action);
    }
  }

  writeTableDocs(schema);
  writeSidebar(schema);
  console.log(`Generated ${schema.size} table docs.`);
}

function ensureTable(schema, tableName) {
  if (!schema.has(tableName)) {
    schema.set(tableName, {
      name: tableName,
      fields: new Map(),
      indexes: [],
      uniqueConstraints: [],
      primaryConstraints: [],
      sources: new Set(),
      actions: [],
    });
  }
  return schema.get(tableName);
}

function extractMethodBody(content, methodName) {
  const marker = `function ${methodName}(`;
  const start = content.indexOf(marker);
  if (start === -1) {
    return '';
  }
  const braceStart = content.indexOf('{', start);
  if (braceStart === -1) {
    return '';
  }
  let depth = 0;
  for (let i = braceStart; i < content.length; i += 1) {
    const char = content[i];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return content.slice(braceStart + 1, i);
      }
    }
  }
  return '';
}

function extractDynamicTables(content) {
  const match = content.match(/private\s+static\s+array\s+\$tables\s*=\s*\[(?<items>[\s\S]*?)\];/);
  if (!match?.groups?.items) {
    return [];
  }
  return [...match.groups.items.matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
}

function extractSchemaBlocks(upBody) {
  const blocks = [];
  const regex = /Schema::(create|table)\(([^,]+),\s*function\s*\(Blueprint \$table\)(?:\s*use\s*\([^)]+\))?\s*\{/g;
  let match;
  while ((match = regex.exec(upBody)) !== null) {
    const action = match[1];
    const tableExpr = match[2].trim();
    const braceStart = regex.lastIndex - 1;
    const bodyInfo = extractBraceBody(upBody, braceStart);
    if (!bodyInfo) {
      continue;
    }
    blocks.push({
      action,
      tableExpr,
      body: bodyInfo.body,
    });
    regex.lastIndex = bodyInfo.end + 2;
  }
  return blocks;
}

function extractBraceBody(source, braceStart) {
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return {
          body: source.slice(braceStart + 1, i),
          end: i,
        };
      }
    }
  }
  return null;
}

function resolveTables(tableExpr, dynamicTables) {
  const literal = tableExpr.match(/['"]([^'"]+)['"]/);
  if (literal) {
    return [literal[1]];
  }
  if (tableExpr === '$table' && dynamicTables.length > 0) {
    return dynamicTables;
  }
  return [];
}

function applyBlock(table, action) {
  const statements = extractTableStatements(action.body);
  for (const statement of statements) {
    const method = extractMethodName(statement);
    if (!method) {
      continue;
    }
    if (dropMethods.has(method)) {
      applyDrop(table, action.migration, method, statement);
      continue;
    }
    if (indexMethods.has(method)) {
      applyStandaloneIndex(table, action.migration, method, statement);
      continue;
    }
    if (specialColumnMethods.has(method)) {
      applySpecialColumns(table, action.migration, method, statement);
      continue;
    }
    applyColumn(table, action.migration, method, statement);
  }
}

function extractTableStatements(body) {
  const normalized = body
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const statements = [];
  let index = 0;
  while (index < normalized.length) {
    const start = normalized.indexOf('$table->', index);
    if (start === -1) {
      break;
    }
    let current = '';
    let depth = 0;
    let quote = '';
    for (let i = start; i < normalized.length; i += 1) {
      const char = normalized[i];
      const prev = normalized[i - 1];
      current += char;
      if (quote) {
        if (char === quote && prev !== '\\') {
          quote = '';
        }
        continue;
      }
      if (char === '"' || char === '\'') {
        quote = char;
      } else if (char === '(' || char === '[') {
        depth += 1;
      } else if (char === ')' || char === ']') {
        depth -= 1;
      } else if (char === ';' && depth === 0) {
        statements.push(current.trim());
        index = i + 1;
        break;
      }
      if (i === normalized.length - 1) {
        index = normalized.length;
      }
    }
  }
  return statements;
}

function extractMethodName(statement) {
  const match = statement.match(/^\$table->([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
  return match ? match[1] : '';
}

function extractCallArguments(statement, method) {
  const marker = `$table->${method}(`;
  const start = statement.indexOf(marker);
  if (start === -1) {
    return '';
  }
  let depth = 0;
  let quote = '';
  let result = '';
  for (let i = start + marker.length; i < statement.length; i += 1) {
    const char = statement[i];
    const prev = statement[i - 1];
    if (quote) {
      result += char;
      if (char === quote && prev !== '\\') {
        quote = '';
      }
      continue;
    }
    if (char === '"' || char === '\'') {
      quote = char;
      result += char;
      continue;
    }
    if (char === '(' || char === '[') {
      depth += 1;
      result += char;
      continue;
    }
    if (char === ')' && depth === 0) {
      return result.trim();
    }
    if (char === ')' || char === ']') {
      depth -= 1;
    }
    result += char;
  }
  return result.trim();
}

function extractStringLiterals(input) {
  return [...input.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function extractArrayLiterals(input) {
  const arrayMatch = input.match(/\[(.*?)\]/);
  if (!arrayMatch) {
    return [];
  }
  return extractStringLiterals(arrayMatch[1]);
}

function applySpecialColumns(table, migration, method, statement) {
  if (method === 'timestamps') {
    upsertField(table, 'created_at', buildField({
      type: 'timestamp',
      nullable: true,
      defaultValue: 'null',
      migration,
      statement,
    }));
    upsertField(table, 'updated_at', buildField({
      type: 'timestamp',
      nullable: true,
      defaultValue: 'null',
      migration,
      statement,
    }));
    return;
  }
  if (method === 'rememberToken') {
    upsertField(table, 'remember_token', buildField({
      type: 'string(100)',
      nullable: true,
      defaultValue: 'null',
      migration,
      statement,
    }));
    return;
  }
  if (method === 'softDeletes') {
    upsertField(table, 'deleted_at', buildField({
      type: 'timestamp',
      nullable: true,
      defaultValue: 'null',
      migration,
      statement,
    }));
    return;
  }
  if (method === 'morphs' || method === 'nullableMorphs') {
    const args = extractCallArguments(statement, method);
    const [prefix] = extractStringLiterals(args);
    if (!prefix) {
      return;
    }
    const nullable = method === 'nullableMorphs';
    upsertField(table, `${prefix}_type`, buildField({
      type: 'string',
      nullable,
      defaultValue: nullable ? 'null' : '',
      migration,
      statement,
    }));
    upsertField(table, `${prefix}_id`, buildField({
      type: 'unsignedBigInteger',
      nullable,
      defaultValue: nullable ? 'null' : '',
      migration,
      statement,
    }));
    table.indexes.push({
      name: '',
      columns: [`${prefix}_type`, `${prefix}_id`],
      migration,
      source: statement.trim(),
    });
  }
}

function applyColumn(table, migration, method, statement) {
  const args = extractCallArguments(statement, method);
  const fieldNames = resolveFieldNames(method, args);
  if (fieldNames.length === 0) {
    return;
  }
  const fieldType = buildFieldType(method, args, fieldNames[0]);
  const nullable = /->nullable\((false|0)\)/.test(statement) ? false : /->nullable\(/.test(statement) || /->nullable\b/.test(statement);
  const defaultValue = extractDefaultValue(statement);
  const comment = extractComment(statement);
  const isChange = /->change\(/.test(statement) || /->change\b/.test(statement);
  const inlineIndex = extractInlineIndexes(statement, fieldNames, migration);

  for (const fieldName of fieldNames) {
    const existing = table.fields.get(fieldName);
    const next = buildField({
      type: fieldType,
      nullable,
      defaultValue,
      migration,
      statement,
      comment,
      previous: existing,
      isChange,
    });
    upsertField(table, fieldName, next);
  }

  for (const entry of inlineIndex) {
    if (entry.kind === 'index') {
      table.indexes.push(entry.payload);
    } else if (entry.kind === 'unique') {
      table.uniqueConstraints.push(entry.payload);
    } else if (entry.kind === 'primary') {
      table.primaryConstraints.push(entry.payload);
    }
  }
}

function resolveFieldNames(method, args) {
  if (['id', 'bigIncrements', 'increments', 'mediumIncrements', 'smallIncrements', 'tinyIncrements'].includes(method)) {
    const explicit = extractStringLiterals(args)[0];
    return [explicit || 'id'];
  }
  const names = extractStringLiterals(args);
  if (names.length > 0) {
    return [names[0]];
  }
  return [];
}

function buildFieldType(method, args, fieldName) {
  const literals = extractStringLiterals(args);
  const firstLiteral = literals[0];
  let suffix = args.trim();
  if (firstLiteral === fieldName) {
    const firstLiteralMatch = suffix.match(/^['"][^'"]+['"]\s*,?\s*/);
    if (firstLiteralMatch) {
      suffix = suffix.slice(firstLiteralMatch[0].length);
    }
  }
  const normalizedMethod = fieldTypeOverrides[method] || method;
  if (!suffix) {
    return normalizedMethod;
  }
  return `${normalizedMethod}(${suffix})`;
}

function extractDefaultValue(statement) {
  const match = statement.match(/->default\(([\s\S]*?)\)/);
  if (!match) {
    if (/->useCurrentOnUpdate\(\)/.test(statement)) {
      return 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
    }
    if (/->useCurrent\(\)/.test(statement)) {
      return 'CURRENT_TIMESTAMP';
    }
    return undefined;
  }
  return normalizeValue(match[1]);
}

function extractComment(statement) {
  const match = statement.match(/->comment\(([\s\S]*?)\)/);
  if (!match) {
    return '';
  }
  return stripQuotes(match[1].trim());
}

function normalizeValue(rawValue) {
  const value = rawValue.trim();
  if (value === 'null') {
    return 'null';
  }
  if (/^['"].*['"]$/.test(value)) {
    return stripQuotes(value);
  }
  return value;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function extractInlineIndexes(statement, fieldNames, migration) {
  const results = [];
  if (/->index\(/.test(statement) || /->index\b/.test(statement)) {
    results.push({
      kind: 'index',
      payload: {
        name: extractNamedIndex(statement, 'index'),
        columns: fieldNames,
        migration,
        source: statement.trim(),
      },
    });
  }
  if (/->unique\(/.test(statement) || /->unique\b/.test(statement)) {
    results.push({
      kind: 'unique',
      payload: {
        name: extractNamedIndex(statement, 'unique'),
        columns: fieldNames,
        migration,
        source: statement.trim(),
      },
    });
  }
  if (/->primary\(/.test(statement) || /->primary\b/.test(statement)) {
    results.push({
      kind: 'primary',
      payload: {
        name: extractNamedIndex(statement, 'primary'),
        columns: fieldNames,
        migration,
        source: statement.trim(),
      },
    });
  }
  return results;
}

function extractNamedIndex(statement, method) {
  const match = statement.match(new RegExp(`->${method}\\(([^)]*)\\)`));
  if (!match) {
    return '';
  }
  const literals = extractStringLiterals(match[1]);
  return literals.length > 0 ? literals[literals.length - 1] : '';
}

function buildField({ type, nullable, defaultValue, migration, statement, comment, previous, isChange }) {
  const field = previous ? { ...previous } : {
    type: '',
    nullable: false,
    defaultValue: undefined,
    comment: '',
    migrations: new Set(),
    statements: [],
  };
  if (!previous || !isChange || type) {
    field.type = type || field.type;
  }
  field.nullable = nullable;
  if (defaultValue !== undefined) {
    field.defaultValue = defaultValue;
  }
  if (comment) {
    field.comment = comment;
  }
  field.migrations.add(migration);
  field.statements.push(statement.trim());
  return field;
}

function upsertField(table, fieldName, field) {
  table.fields.set(fieldName, field);
}

function applyStandaloneIndex(table, migration, method, statement) {
  const args = extractCallArguments(statement, method);
  const columns = extractArrayLiterals(args);
  if (columns.length === 0) {
    const literals = extractStringLiterals(args);
    if (literals.length > 0) {
      columns.push(literals[0]);
    }
  }
  const payload = {
    name: extractStringLiterals(args).length > columns.length ? extractStringLiterals(args).slice(-1)[0] : '',
    columns,
    migration,
    source: statement.trim(),
  };
  if (method === 'index') {
    table.indexes.push(payload);
  } else if (method === 'unique') {
    table.uniqueConstraints.push(payload);
  } else if (method === 'primary') {
    table.primaryConstraints.push(payload);
  }
}

function applyDrop(table, migration, method, statement) {
  const args = extractCallArguments(statement, method);
  if (method === 'dropColumn') {
    const columns = extractArrayLiterals(args);
    if (columns.length > 0) {
      for (const column of columns) {
        table.fields.delete(column);
      }
      return;
    }
    const literals = extractStringLiterals(args);
    for (const column of literals) {
      table.fields.delete(column);
    }
    return;
  }
  const names = extractStringLiterals(args);
  const value = names[names.length - 1] || stripQuotes(args);
  if (method === 'dropIndex') {
    table.indexes = table.indexes.filter((item) => item.name !== value);
  } else if (method === 'dropUnique') {
    table.uniqueConstraints = table.uniqueConstraints.filter((item) => item.name !== value);
  } else if (method === 'dropPrimary') {
    table.primaryConstraints = table.primaryConstraints.filter((item) => item.name !== value);
  }
  table.sources.add(migration);
}

function getModuleName(tableName) {
  for (const moduleName of moduleOrder) {
    if ((moduleMap[moduleName] || []).includes(tableName)) {
      return moduleName;
    }
  }
  return '其他模块';
}

function getTableLabel(tableName) {
  return tableLabels[tableName] || '数据表';
}

function getRelationships(tableName, table) {
  const relationships = [];
  const columnNames = [...table.fields.keys()];
  for (const [fieldName, target] of relationshipHints) {
    if (columnNames.includes(fieldName)) {
      relationships.push(`- 字段命名关联：\`${fieldName}\` -> \`${target}\``);
    }
  }
  if (tableName === 'users') {
    relationships.push('- 字段命名关联：`passkey` 被 Tracker、下载鉴权和日志链路引用');
  }
  return dedupe(relationships);
}

function dedupe(items) {
  return [...new Set(items)];
}

function writeTableDocs(schema) {
  if (fs.existsSync(tableDocsDir)) {
    fs.rmSync(tableDocsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tableDocsDir, { recursive: true });

  const orderedTables = [...schema.keys()].sort((a, b) => a.localeCompare(b));
  for (const tableName of orderedTables) {
    const table = schema.get(tableName);
    const doc = renderTableDoc(tableName, table);
    const moduleDir = path.join(tableDocsDir, getModuleDirName(tableName));
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(path.join(moduleDir, `${tableName}.md`), doc, 'utf8');
  }
}

function renderTableDoc(tableName, table) {
  const moduleName = getModuleName(tableName);
  const fieldRows = [...table.fields.entries()]
    .map(([fieldName, field]) => {
      const migrations = [...field.migrations].sort().join('<br />');
      const nullable = field.nullable ? '是' : '否';
      const defaultValue = field.defaultValue === undefined ? '无' : `\`${escapePipes(field.defaultValue)}\``;
      const comment = field.comment ? escapePipes(field.comment) : '';
      return `| \`${fieldName}\` | \`${escapePipes(field.type || '')}\` | ${nullable} | ${defaultValue} | ${escapePipes(migrations)} | ${comment || ' '} |`;
    })
    .join('\n');

  const indexLines = renderConstraintList(table.indexes, '索引');
  const uniqueLines = renderConstraintList(table.uniqueConstraints, '唯一约束');
  const primaryLines = renderConstraintList(table.primaryConstraints, '主键/主键声明');
  const relationships = getRelationships(tableName, table);
  const sources = [...table.sources].sort().map((item) => `- \`${item}\``).join('\n');

  return [
    '---',
    `slug: /database-design/tables/${tableName}`,
    `title: ${tableName}`,
    '---',
    '',
    `# \`${tableName}\``,
    '',
    '## 表定位',
    '',
    `- 模块：${moduleName}`,
    `- 中文名称：${getTableLabel(tableName)}`,
    `- 表名：\`${tableName}\``,
    '',
    '## 来源对照',
    '',
    sources || '- 未解析到迁移来源',
    '',
    '## 字段清单',
    '',
    '| 字段名 | 当前类型 | 可空 | 默认值 | 来源迁移 | 备注 |',
    '| --- | --- | --- | --- | --- | --- |',
    fieldRows || '| - | - | - | - | - | - |',
    '',
    '## 约束清单',
    '',
    '### 主键与主键声明',
    '',
    primaryLines,
    '',
    '### 唯一约束',
    '',
    uniqueLines,
    '',
    '## 索引清单',
    '',
    indexLines,
    '',
    '## 关系清单',
    '',
    relationships.length > 0 ? relationships.join('\n') : '- 当前迁移中未声明外键，表间关系主要通过字段命名表达。',
    '',
    '## 迁移备注',
    '',
    '- 当前文档按迁移代码推导现状，不额外补充业务推测。',
    '- 如同一字段经历 `change()` 或多次追加，字段清单展示的是迁移链最终形态。',
    '',
  ].join('\n');
}

function getModuleDirName(tableName) {
  return moduleDirMap[getModuleName(tableName)] || moduleDirMap['其他模块'];
}

function escapePipes(input) {
  return String(input).replace(/\|/g, '\\|').replace(/\n/g, '<br />');
}

function renderConstraintList(items, fallbackLabel) {
  if (!items || items.length === 0) {
    return '- 未发现';
  }
  return dedupe(items.map((item) => {
    const columns = item.columns.length > 0 ? item.columns.map((column) => `\`${column}\``).join(', ') : '未显式列出字段';
    const name = item.name ? `，名称：\`${item.name}\`` : '';
    return `- ${fallbackLabel}字段：${columns}${name}，来源：\`${item.migration}\``;
  })).join('\n');
}

function renderTableItem(tableName) {
  return `        {\n          type: 'doc',\n          id: '${getDocSidebarId(tableName)}',\n          label: '${getTableLabel(tableName)}[${tableName}]',\n        },`;
}

function writeSidebar(schema) {
  const current = fs.readFileSync(sidebarPath, 'utf8');
  const tablesByModule = new Map(moduleOrder.map((moduleName) => [moduleName, []]));
  for (const tableName of [...schema.keys()].sort((a, b) => a.localeCompare(b))) {
    const moduleName = getModuleName(tableName);
    tablesByModule.get(moduleName).push(tableName);
  }

  const moduleBlocks = moduleOrder
    .filter((moduleName) => tablesByModule.get(moduleName).length > 0)
    .map((moduleName) => {
      const items = tablesByModule.get(moduleName).map((tableName) => renderTableItem(tableName)).join('\n');
      return [
        '    {',
        "      type: 'category',",
        `      label: '${moduleName}',`,
        '      items: [',
        items,
        '      ],',
        '    },',
      ].join('\n');
    })
    .join('\n');

  const next = current.replace(
    /  databaseSidebar:\s*\[[\s\S]*?\n  \],/m,
    `  databaseSidebar: [\n${moduleBlocks}\n  ],`,
  );
  fs.writeFileSync(sidebarPath, next, 'utf8');
}

function getDocSidebarId(tableName) {
  return `database-design/tables/${getModuleDirName(tableName)}/${tableName}`;
}

main();

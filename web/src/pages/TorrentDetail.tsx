import { useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Descriptions, Tag, Button, Card, Spin, Typography, Space, Table, message, Input, List, Upload, Tooltip } from 'antd'
import { ArrowLeftOutlined, DownloadOutlined, HeartOutlined, HeartFilled, ThunderboltOutlined, FileTextOutlined, EditOutlined, ClockCircleOutlined, CloudDownloadOutlined, TeamOutlined } from '@ant-design/icons'
import { getTorrent, getPeers, checkBookmark, addBookmark, removeBookmark, getComments, createComment, thankTorrent, getThanksCount, checkThanks, getSubtitles, uploadSubtitle } from '../api/torrent'
import { useAuthStore } from '../store/auth'
import { formatSize, formatDuration } from '../utils/format'
import type { PeerInfo, Comment, Subtitle } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)

const { Title, Text } = Typography
const { TextArea } = Input

const CATEGORY_LABELS: Record<string, string> = {
  movie: 'Movies',
  tv: 'TV Series',
  music: 'Music',
  game: 'Games',
  software: 'Software',
  documentary: 'Documentary',
  anime: 'Anime',
  ebook: 'E-Book',
  unsorted: 'Unsorted',
}

export function TorrentDetail() {
  const { t } = useTranslation('torrent')
  const { t: tCommon } = useTranslation('common')
  const { t: tPromo } = useTranslation('promotions')
  const { id, lang } = useParams({ from: '/$lang/torrents_/$id' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const torrentId = Number(id)
  const [commentText, setCommentText] = useState('')

  const { data: torrent, isLoading } = useQuery({
    queryKey: ['torrent', id],
    queryFn: () => getTorrent(torrentId),
    select: (res) => res.data,
  })

  const { data: peers } = useQuery({
    queryKey: ['peers', id],
    queryFn: () => getPeers(torrentId),
    select: (res) => res.data.peers,
  })

  const { data: bookmarkStatus } = useQuery({
    queryKey: ['bookmark', id],
    queryFn: () => checkBookmark(torrentId),
    select: (res) => res.data.bookmarked,
  })

  const { data: commentsData } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(torrentId),
  })

  const { data: thanksCount } = useQuery({
    queryKey: ['thanks-count', id],
    queryFn: () => getThanksCount(torrentId),
    select: (res) => res.data.count,
  })

  const { data: thanked } = useQuery({
    queryKey: ['thanks-check', id],
    queryFn: () => checkThanks(torrentId),
    select: (res) => res.data.thanked,
  })

  const { data: subtitles } = useQuery({
    queryKey: ['subtitles', id],
    queryFn: () => getSubtitles(torrentId),
    select: (res) => res.data.subtitles,
  })

  const { user: currentUser } = useAuthStore()

  const addBm = useMutation({
    mutationFn: () => addBookmark(torrentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', id] })
      message.success(t('bookmarked'))
    },
    onError: () => message.error(t('bookmarkFailed')),
  })

  const removeBm = useMutation({
    mutationFn: () => removeBookmark(torrentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', id] })
      message.success(t('bookmarkRemoved'))
    },
    onError: () => message.error(t('removeBookmarkFailed')),
  })

  const addComment = useMutation({
    mutationFn: (content: string) => createComment(torrentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setCommentText('')
      message.success(t('commentSuccess'))
    },
    onError: () => message.error(t('commentFailed')),
  })

  const sendThanks = useMutation({
    mutationFn: () => thankTorrent(torrentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thanks-count', id] })
      queryClient.invalidateQueries({ queryKey: ['thanks-check', id] })
      message.success(t('thankSuccess'))
    },
    onError: () => message.error(t('thankFailed')),
  })

  const subUpload = useMutation({
    mutationFn: (formData: FormData) => uploadSubtitle(torrentId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtitles', id] })
      message.success(t('subtitleSuccess'))
    },
    onError: () => message.error(t('subtitleFailed')),
  })

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
  if (!torrent) return <p>{t('notFound')}</p>

  const peerColumns: ColumnsType<PeerInfo> = [
    { title: t('user'), dataIndex: 'username', key: 'username' },
    {
      title: t('status'),
      dataIndex: 'is_seeding',
      key: 'is_seeding',
      render: (v: boolean) => (v ? <Tag color="green">{t('seeder')}</Tag> : <Tag color="orange">{t('leecher')}</Tag>),
    },
    { title: t('uploaded'), dataIndex: 'uploaded', key: 'uploaded', render: (v: number) => formatSize(v) },
    { title: t('downloaded'), dataIndex: 'downloaded', key: 'downloaded', render: (v: number) => formatSize(v) },
    { title: t('ip'), dataIndex: 'ip', key: 'ip' },
    { title: t('port'), dataIndex: 'port', key: 'port' },
    { title: t('lastSeen'), dataIndex: 'last_seen', key: 'last_seen' },
  ]

  const isBookmarked = bookmarkStatus ?? false

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Link to={`/${lang}`}><Button icon={<ArrowLeftOutlined />}>{tCommon('back')}</Button></Link>
      </Space>

      <Card>
        <Title level={4} style={{ marginBottom: 16 }}>{torrent.name}</Title>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('category')}>
            <Tag color="blue">{CATEGORY_LABELS[torrent.category] || torrent.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('size')}>
            <span style={{ fontWeight: 500 }}>{formatSize(torrent.size)}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('files')}>{torrent.file_count} 个文件</Descriptions.Item>
          <Descriptions.Item label={t('uploader')}>{torrent.uploader}</Descriptions.Item>
          {torrent.seed_hours !== undefined && torrent.seed_hours > 0 && (
            <Descriptions.Item label={<><ClockCircleOutlined /> {t('seedTime')}</>}>
              {formatDuration(torrent.seed_hours)}
            </Descriptions.Item>
          )}
          {torrent.promotion && torrent.promotion !== 'none' && (
            <Descriptions.Item label={t('promotion')}>
              {torrent.promotion === 'free' && <Tag color="green">{tPromo('freeleech')}</Tag>}
              {torrent.promotion === 'twoup' && <Tag color="blue">{tPromo('twoupUpload')}</Tag>}
              {torrent.promotion === 'free_twoup' && <><Tag color="green">{tPromo('freeleech')}</Tag> <Tag color="blue">{tPromo('twoupUpload')}</Tag></>}
              {torrent.promotion === 'thirty_percent' && <Tag color="orange">{tPromo('thirtyCredit')}</Tag>}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={<><TeamOutlined /> {t('seeders')}</>}>
            <span style={{ color: '#52c41a', fontWeight: 500 }}>{torrent.seeders}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<><CloudDownloadOutlined /> {t('leechers')}</>}>
            <span style={{ color: '#faad14', fontWeight: 500 }}>{torrent.leechers}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('completed')}>
            <Tooltip title="下载完成次数">
              <span>{torrent.completed}</span>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={t('created')}>
            {dayjs(torrent.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label={t('infoHash')} span={2}>
            <code style={{ fontSize: 12, background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{torrent.info_hash}</code>
          </Descriptions.Item>
        </Descriptions>

        {torrent.description && (
          <Card size="small" title={t('description')} style={{ marginTop: 16 }}>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{torrent.description}</pre>
          </Card>
        )}

        <Space style={{ marginTop: 16 }}>
          <Button type="primary" icon={<DownloadOutlined />} size="large" href={`/api/torrents/${torrent.id}/download`}>
            {t('download')}
          </Button>
          <Button icon={isBookmarked ? <HeartFilled /> : <HeartOutlined />} danger={isBookmarked}
            onClick={() => (isBookmarked ? removeBm.mutate() : addBm.mutate())}
            loading={addBm.isPending || removeBm.isPending}>
            {isBookmarked ? t('bookmarked') : t('bookmark')}
          </Button>
          {(currentUser?.role === 'admin' || currentUser?.id === torrent.user_id) && (
            <Button icon={<EditOutlined />} onClick={() => navigate({ to: `/${lang}/torrents/$id/edit`, params: { id } })}>
              Edit
            </Button>
          )}
          <Button icon={<ThunderboltOutlined />} onClick={() => sendThanks.mutate()} loading={sendThanks.isPending}
            disabled={thanked}>
            {thanked ? t('thanked', { count: thanksCount ?? 0 }) : t('thank', { count: thanksCount ?? 0 })}
          </Button>
        </Space>
      </Card>

      <Card title={t('subtitles', { count: subtitles?.length ?? 0 })} style={{ marginTop: 16 }}>
        <Upload.Dragger
          accept=".srt,.ass,.ssa,.sub,.idx"
          multiple={false}
          showUploadList={false}
          beforeUpload={(file) => {
            const formData = new FormData()
            formData.append('subtitle_file', file)
            formData.append('language', file.name.split('.').pop()?.toLowerCase() === 'chs' ? 'Chinese' : 'English')
            formData.append('title', file.name)
            subUpload.mutate(formData)
            return false
          }}
          style={{ marginBottom: 16 }}
        >
          <p className="ant-upload-text">{t('uploadSubtitle')}</p>
        </Upload.Dragger>
        <List
          size="small"
          dataSource={subtitles}
          locale={{ emptyText: t('noSubtitles') }}
          renderItem={(sub: Subtitle) => (
            <List.Item>
              <span><FileTextOutlined /> {sub.title || sub.language}</span>
              <span style={{ fontSize: 12, color: '#888' }}>{formatSize(sub.file_size)} {t('by')} {sub.username}</span>
              <span><a href={`/api/subtitles/${sub.id}/download`}>{t('download')}</a> ({t('hits', { count: sub.hits })})</span>
            </List.Item>
          )}
        />
      </Card>

      <Card title={t('peers', { count: peers?.length ?? 0 })} style={{ marginTop: 16 }}>
        <Table columns={peerColumns} dataSource={peers} rowKey={(r) => `${r.user_id}-${r.ip}-${r.port}`} size="small" pagination={false} />
      </Card>

      <Card title={t('comments', { count: commentsData?.data?.total ?? 0 })} style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={t('writeComment')} />
          <Button type="primary" onClick={() => addComment.mutate(commentText)} loading={addComment.isPending} disabled={!commentText.trim()}>
            {t('postComment')}
          </Button>
        </Space>
        <List
          style={{ marginTop: 16 }}
          dataSource={commentsData?.data?.comments ?? []}
          locale={{ emptyText: t('noComments') }}
          renderItem={(c: Comment) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <Space>
                  <Text strong>{c.username}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(c.created_at).fromNow()}</Text>
                </Space>
                <div style={{ marginTop: 4 }}>{c.content}</div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

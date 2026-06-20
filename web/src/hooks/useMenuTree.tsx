import { useMemo } from 'react'
import { useNavigate, useParams, useRouter } from '@tanstack/react-router'
import {
  BulbOutlined,
  CommentOutlined,
  DashboardOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { langPath } from '../utils/lang'

const iconMap: Record<string, React.ReactNode> = {
  BulbOutlined: <BulbOutlined />,
  CommentOutlined: <CommentOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  SearchOutlined: <SearchOutlined />,
  UserOutlined: <UserOutlined />,
}

interface RouteMenuInfo {
  routeId: string
  path: string
  title: string
  menuCode?: string
  menuIcon?: string
  menuSort: number
}

function getParentRouteId(routeId: string): string | null {
  const id = routeId.replace(/^\/\$lang/, '')
  if (!id || id === '/') return null
  const lastSlash = id.lastIndexOf('/')
  if (lastSlash === 0) return null
  return '/$lang' + id.substring(0, lastSlash)
}

export function useMenuTree() {
  const router = useRouter()
  const { lang } = useParams({ from: '/$lang' })
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { t: tAdmin } = useTranslation('admin')

  return useMemo(() => {
    const routesById = router.routesById as Record<string, any>
    const collected: RouteMenuInfo[] = []
    const byId = new Map<string, RouteMenuInfo>()

    for (const routeId of Object.keys(routesById)) {
      const route = routesById[routeId]
      const sd = route.options?.staticData
      if (!sd || sd.menuSort === undefined) continue
      const info: RouteMenuInfo = {
        routeId,
        path: routeId.replace('/$lang', '') || '/',
        title: sd.title || '',
        menuCode: sd.menuCode,
        menuIcon: sd.menuIcon,
        menuSort: sd.menuSort,
      }
      collected.push(info)
      byId.set(routeId, info)
    }

    const childrenMap = new Map<string, RouteMenuInfo[]>()
    const roots: RouteMenuInfo[] = []

    for (const info of collected) {
      const parentId = getParentRouteId(info.routeId)
      if (!parentId || !byId.has(parentId)) {
        roots.push(info)
      } else {
        if (!childrenMap.has(parentId)) childrenMap.set(parentId, [])
        childrenMap.get(parentId)!.push(info)
      }
    }

    roots.sort((a, b) => a.menuSort - b.menuSort)

    function buildItem(info: RouteMenuInfo): any {
      const titleKey = info.title
      const labelStr = titleKey.startsWith('admin:')
        ? tAdmin(titleKey.replace('admin:', ''))
        : t(titleKey)

      const children = childrenMap.get(info.routeId)
      if (children) {
        children.sort((a, b) => a.menuSort - b.menuSort)
        const firstChild = children[0]
        const nav = () => navigate({ to: langPath(lang, firstChild.path) as any })
        return {
          key: info.menuCode || info.path,
          icon: info.menuIcon ? iconMap[info.menuIcon] : undefined,
          label: labelStr,
          children: children.map(buildItem),
          onClick: nav,
          onTitleClick: nav,
          _path: firstChild.path,
        }
      }

      return {
        key: info.menuCode || info.path,
        icon: info.menuIcon ? iconMap[info.menuIcon] : undefined,
        label: labelStr,
        onClick: () => navigate({ to: langPath(lang, info.path) as any }),
        _path: info.path,
      }
    }

    return roots.map(buildItem)
  }, [router, lang, navigate, t, tAdmin])
}

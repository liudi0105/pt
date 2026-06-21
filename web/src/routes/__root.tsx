import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    useLocation,
    useMatches,
    useNavigate,
    useParams
} from '@tanstack/react-router'
import type {QueryClient} from '@tanstack/react-query'
import {useEffect, useMemo} from 'react'
import type {MenuProps} from 'antd'
import {Layout, Menu, Spin, theme} from 'antd'

interface RouterContext {
    queryClient: QueryClient
}
import {Navbar} from '../components/Navbar'
import {NProgressProvider} from '../components/NProgressProvider'
import {langPath, normalizeLang} from '../utils/lang'
import i18n, {i18nReady} from '../i18n'
import {useAuthStore} from '../store/auth'
import {getProfile} from '../api/user'
import {useMenuTree} from '../hooks/useMenuTree'
import 'nprogress/nprogress.css'

const {Content, Sider} = Layout

const APP_NAME = 'pt-web'

function getLangFromCookie(): string {
    const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
    return normalizeLang(match ? decodeURIComponent(match[1]) : undefined) ?? 'zh'
}

export const Route = createRootRouteWithContext<RouterContext>()({
    loader: async () => {
        await i18nReady
        const {token, user} = useAuthStore.getState()
        if (token && !user) {
            try {
                const res = await getProfile()
                useAuthStore.getState().setAuth(token, res.data)
            } catch {
                // token invalid, ignore
            }
        }
        return {ready: true}
    },
    pendingComponent: () => (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Spin size="large"/>
        </div>
    ),
    head: (ctx) => {
        const lastMatch = ctx.matches[ctx.matches.length - 1]
        const titleKey = lastMatch?.staticData?.title
        const title = titleKey ? i18n.t(titleKey) : ''

        return {
            meta: [
                {
                    title: title ? `${title} - ${APP_NAME}` : APP_NAME,
                },
            ],
        }
    },
    component: RootLayout,
})

function RootLayout() {
    const location = useLocation()
    const pathname = location.pathname
    const {token} = theme.useToken()

    const hasLangPrefix = /^\/(zh|en)(\/|$)/.test(pathname)

    useEffect(() => {
        if (!hasLangPrefix) {
            const lang = getLangFromCookie()
            window.location.assign(langPath(lang, pathname) + window.location.search)
        }
    }, [hasLangPrefix, pathname])

    if (!hasLangPrefix) {
        return null
    }

    const matches = useMatches()
    const menuTree = useMenuTree()

    const navigate = useNavigate()
    const {lang} = useParams({from: '/$lang'})
    const matchedKeys = matches.map(m => m.staticData?.menuCode).filter(Boolean) as string[]
    let hasSidebar = false
    let sidebarItems: any[] | undefined
    for (const item of menuTree) {
        const key = (item as any).key
        if (!(item as any).children?.length) continue
        if (matchedKeys.includes(key)) {
            hasSidebar = true
            sidebarItems = (item as any).children
            break
        }
    }

    const menuPathMap = useMemo(() => {
        const map = new Map<string, string>()

        function walk(items: any[]) {
            for (const item of items) {
                if (item._path) map.set(item.key, item._path)
                if (item.children) walk(item.children)
            }
        }

        walk(menuTree)
        return map
    }, [menuTree])

    const handleSidebarClick: MenuProps['onClick'] = ({key}) => {
        const path = menuPathMap.get(key)
        if (path) {
            navigate({to: langPath(lang, path) as any})
        }
    }

    const selectedKeys = matchedKeys

    return (
        <NProgressProvider>
            <HeadContent/>
            <Layout style={{minHeight: '100vh', background: token.colorBgLayout}}>
                <Navbar/>
                <Layout>
                    {hasSidebar && (
                        <Sider width={220} style={{
                            background: token.colorBgContainer,
                            borderRight: `1px solid ${token.colorBorderSecondary}`
                        }}>
                            <Menu
                                mode="inline"
                                selectedKeys={selectedKeys}
                                items={sidebarItems}
                                onClick={handleSidebarClick}
                                style={{borderRight: 0, height: '100%'}}
                            />
                        </Sider>
                    )}
                    <Content style={
                        hasSidebar
                            ? {padding: 24, background: token.colorBgLayout}
                            : {
                                padding: '24px',
                                maxWidth: 1200,
                                margin: '0 auto',
                                width: '100%',
                                background: token.colorBgLayout
                            }
                    }>
                        <Outlet/>
                    </Content>
                </Layout>
            </Layout>
        </NProgressProvider>
    )
}

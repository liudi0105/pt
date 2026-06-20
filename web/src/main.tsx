import './index.css'
import './i18n'
import {StrictMode, useMemo} from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {ConfigProvider, theme, type ThemeConfig} from 'antd'
import zhCN from 'antd/locale/zh_CN'
import {useTranslation} from 'react-i18next'
import {routeTree} from './routeTree.gen'
import {ThemeProvider, useThemeMode} from './contexts/ThemeContext'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            retry: 1,
        },
    },
})

const router = createRouter({
    routeTree,
    context: {queryClient},
    defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function AppProvidersInner() {
    const {i18n} = useTranslation()
    const {themeMode} = useThemeMode()
    const antdLocale = useMemo(
        () => (i18n.language.startsWith('zh') ? zhCN : undefined),
        [i18n.language],
    )
    const antdTheme = useMemo<ThemeConfig>(
        () => {
            return themeMode === 'dark'
                ? {
                    algorithm: theme.darkAlgorithm, components: {
                        Layout: {
                            headerBg: theme.getDesignToken({algorithm: theme.darkAlgorithm}).colorBgContainer,
                            siderBg: theme.getDesignToken({algorithm: theme.darkAlgorithm}).colorBgContainer,
                        }
                    }
                }
                : {
                    algorithm: theme.defaultAlgorithm, components: {
                        Layout: {
                            headerBg: theme.getDesignToken({algorithm: theme.defaultAlgorithm}).colorBgContainer,
                            siderBg: theme.getDesignToken({algorithm: theme.defaultAlgorithm}).colorBgContainer,
                        }
                    }
                }
        },
        [themeMode],
    )

    return (
        <ConfigProvider locale={antdLocale} theme={antdTheme}>
            <RouterProvider router={router}/>
        </ConfigProvider>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AppProvidersInner/>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
)

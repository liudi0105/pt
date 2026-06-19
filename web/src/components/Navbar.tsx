import {Link, useMatches, useNavigate, useParams} from '@tanstack/react-router'
import type {MenuProps} from 'antd'
import {Flex, Layout, Menu, Typography} from 'antd'
import {
    BulbOutlined,
    CheckCircleOutlined,
    DashboardOutlined,
    GiftOutlined,
    GlobalOutlined,
    HeartOutlined,
    LogoutOutlined,
    MailOutlined,
    SearchOutlined,
    TrophyOutlined,
    UploadOutlined,
    UserOutlined,
    WarningOutlined,
} from '@ant-design/icons'
import {useAuthStore} from '../store/auth'
import {useTranslation} from 'react-i18next'
import {langPath} from '../utils/lang'
import NProgress from 'nprogress'

const {Header} = Layout

export function Navbar() {
    const {token, user, logout} = useAuthStore()
    const {t, i18n} = useTranslation()
    const {lang} = useParams({from: '/$lang'})
    const navigate = useNavigate()
    const matches = useMatches()
    const isAdmin = user?.role === 'admin'

    const selectedKeys = matches
      .map(m => m.staticData?.menuCode)
      .filter(Boolean) as string[]

    const go = (path: string) => {
        navigate({to: langPath(lang, path) as any})
    }

    const handleLogout = () => {
        logout()
        NProgress.start()
    }

    const handleLangChange = (newLang: string) => {
        const currentPath = window.location.pathname
        const pathWithoutLang = currentPath.replace(/^\/(zh|en)/, '') || '/'
        window.location.assign(langPath(newLang, pathWithoutLang) + window.location.search)
    }

    const handleMenuClick: MenuProps['onClick'] = ({key}) => {
        switch (key) {
            case 'torrents':
                go('/torrents');
                break
            case 'offers':
                go('/offers');
                break
            case 'upload':
                go('/torrents/upload');
                break
            case 'admin':
                go('/admin');
                break
            case 'profile':
                go('/user');
                break
            case 'checkin':
                go('/user?tab=checkin');
                break
            case 'seeding':
                go('/user?tab=seeding');
                break
            case 'bookmarks':
                go('/user?tab=bookmarks');
                break
            case 'bonus':
                go('/user?tab=bonus');
                break
            case 'messages':
                go('/messages');
                break
            case 'invites':
                go('/invites');
                break
            case 'medals':
                go('/medals');
                break
            case 'hr':
                go('/hr');
                break
            case 'zh':
                handleLangChange('zh');
                break
            case 'en':
                handleLangChange('en');
                break
            case 'login':
                go('/login');
                break
            case 'register':
                go('/register');
                break
            case 'logout':
                handleLogout();
                break
        }
    }

    const leftItems: MenuProps['items'] = [
        {key: 'torrents', icon: <SearchOutlined/>, label: t('nav.torrents')},
        ...(token ? [
            {key: 'offers', icon: <BulbOutlined/>, label: t('nav.candidates')},
            {key: 'upload', icon: <UploadOutlined/>, label: t('nav.upload')},
        ] : []),
        ...(isAdmin ? [
            {key: 'admin', icon: <DashboardOutlined/>, label: t('nav.adminPanel')},
        ] : []),
    ]

    const rightItems: MenuProps['items'] = [
        {
            key: 'lang', icon: <GlobalOutlined/>, label: i18n.language.startsWith('zh') ? '中文' : 'EN',
            children: [
                {key: 'zh', label: '中文'},
                {key: 'en', label: 'English'},
            ],
        },
        ...(token ? [
            {
                key: 'user', icon: <UserOutlined/>, label: user?.username || t('nav.userCenter'),
                children: [
                    {key: 'profile', icon: <UserOutlined/>, label: t('nav.profile')},
                    {key: 'checkin', icon: <CheckCircleOutlined/>, label: t('nav.checkin')},
                    {key: 'seeding', icon: <UploadOutlined/>, label: t('nav.seeding')},
                    {key: 'bookmarks', icon: <HeartOutlined/>, label: t('nav.bookmarks')},
                    {key: 'bonus', icon: <TrophyOutlined/>, label: t('nav.bonusShop')},
                    {type: 'divider' as const},
                    {key: 'messages', icon: <MailOutlined/>, label: t('nav.messages')},
                    {key: 'invites', icon: <GiftOutlined/>, label: t('nav.invites')},
                    {key: 'medals', icon: <TrophyOutlined/>, label: t('nav.medals')},
                    {key: 'hr', icon: <WarningOutlined/>, label: t('nav.hr')},
                    {type: 'divider' as const},
                    {key: 'logout', icon: <LogoutOutlined/>, label: t('nav.logout')},
                ],
            },
        ] : [
            {key: 'login', label: t('nav.login')},
            {key: 'register', label: t('nav.register')},
        ]),
    ]

    return (
        <Header style={{display: 'flex', alignItems: 'center', padding: '0 16px', height: 48, lineHeight: '48px'}}>
            <Link to="/$lang" params={{lang}}
                  style={{color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 24}}>
                <Typography.Title level={4} style={{color: '#fff', margin: 0, fontSize: 18}}>
                    {t('brand')}
                </Typography.Title>
            </Link>
            <Flex style={{flexGrow: 1}} justify='space-between'>
                <Menu mode="horizontal" theme="dark" items={leftItems} onClick={handleMenuClick}
                      selectedKeys={selectedKeys}
                />
                <Menu mode="horizontal" theme="dark" items={rightItems} onClick={handleMenuClick}
                      selectable={false} style={{flexGrow: 1, justifyContent: 'end'}}
                />
            </Flex>
        </Header>
    )
}

import {useCallback} from 'react'
import type {MenuProps} from 'antd'
import {Menu} from 'antd'
import {
    CheckCircleOutlined,
    GiftOutlined,
    HeartOutlined,
    LogoutOutlined,
    MailOutlined,
    TrophyOutlined,
    UploadOutlined,
    UserOutlined,
    WarningOutlined,
} from '@ant-design/icons'
import {useNavigate, useParams} from '@tanstack/react-router'
import {useTranslation} from 'react-i18next'
import NProgress from 'nprogress'
import {langPath} from '../utils/lang'
import {useAuthStore} from '../store/auth'

export function UserMenu() {
    const {token, user, logout} = useAuthStore()
    const {t} = useTranslation()
    const {lang} = useParams({from: '/$lang'})
    const navigate = useNavigate()

    const go = useCallback((path: string) => {
        navigate({to: langPath(lang, path) as any})
    }, [lang, navigate])

    const handleClick: MenuProps['onClick'] = useCallback(({key}) => {
        switch (key) {
            case 'profile':
                go('/user-center')
                break
            case 'checkin':
                go('/user-center/checkin')
                break
            case 'seeding':
                go('/user-center/seeding')
                break
            case 'bookmarks':
                go('/user-center/bookmarks')
                break
            case 'bonus':
                go('/user-center/bonus')
                break
            case 'shop':
                go('/user-center/bonus/shop')
                break
            case 'lucky-draw':
                go('/user-center/bonus/lucky-draw')
                break
            case 'big-small':
                go('/user-center/bonus/big-small')
                break
            case 'messages':
                go('/user-center/messages')
                break
            case 'invites':
                go('/user-center/invites')
                break
            case 'medals':
                go('/user-center/medals')
                break
            case 'hr':
                go('/user-center/hr')
                break
            case 'login':
                go('/login')
                break
            case 'register':
                go('/register')
                break
            case 'logout':
                logout()
                NProgress.start()
                break
        }
    }, [go, logout])

    const items: MenuProps['items'] = token
        ? [
            {
                key: 'user',
                icon: <UserOutlined/>,
                label: user?.username || t('nav.userCenter'),
                children: [
                    {key: 'profile', icon: <UserOutlined/>, label: t('nav.profile')},
                    {key: 'checkin', icon: <CheckCircleOutlined/>, label: t('nav.checkin')},
                    {key: 'seeding', icon: <UploadOutlined/>, label: t('nav.seeding')},
                    {key: 'bookmarks', icon: <HeartOutlined/>, label: t('nav.bookmarks')},
                    {
                        key: 'bonus-sub',
                        icon: <TrophyOutlined/>,
                        label: t('nav.bonusShop'),
                        children: [
                            {key: 'bonus', label: t('nav.bonusExchange')},
                            {key: 'shop', label: t('nav.shop')},
                            {key: 'lucky-draw', label: t('nav.luckyDraw')},
                            {key: 'big-small', label: t('nav.bigSmall')},
                        ],
                    },
                    {type: 'divider' as const},
                    {key: 'messages', icon: <MailOutlined/>, label: t('nav.messages')},
                    {key: 'invites', icon: <GiftOutlined/>, label: t('nav.invites')},
                    {key: 'medals', icon: <TrophyOutlined/>, label: t('nav.medals')},
                    {key: 'hr', icon: <WarningOutlined/>, label: t('nav.hr')},
                    {type: 'divider' as const},
                    {key: 'logout', icon: <LogoutOutlined/>, label: t('nav.logout')},
                ],
            },
        ]
        : [
            {key: 'login', label: t('nav.login')},
            {key: 'register', label: t('nav.register')},
        ]

    return (
        <Menu
            mode="horizontal"
            items={items}
            onClick={handleClick}
            selectable={false}
            style={{justifyContent: 'end'}}
        />
    )
}

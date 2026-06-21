import {Link, useMatches, useParams} from '@tanstack/react-router'
import {Flex, Layout, Menu, Typography, theme} from 'antd'
import {useTranslation} from 'react-i18next'
import {useMenuTree} from '../hooks/useMenuTree'
import {HeaderActions} from './HeaderActions'

const {Header} = Layout

export function Navbar() {
    const {t} = useTranslation()
    const {lang} = useParams({from: '/$lang'})
    const {token} = theme.useToken()
    const matches = useMatches()
    const menuTree = useMenuTree()

    const selectedKeys = matches
        .map(m => m.staticData?.menuCode)
        .filter(Boolean) as string[]

    const leftItems: any[] = menuTree
        .filter((item: any) => item.key !== 'admin')
        .map((item: any) => {
            if (item.children) {
                const {children: _, ...rest} = item
                return rest
            }
            return item
        })

    const adminItem = menuTree.find((item: any) => item.key === 'admin')
    if (adminItem) {
        const {children: _, ...rest} = adminItem as any
        leftItems.push(rest)
    }

    return (
        <Header style={{display: 'flex', alignItems: 'center', padding: '0 0 0 16px', height: 48, lineHeight: '48px', background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
            <Link to="/$lang" params={{lang}}
                  style={{color: token.colorText, textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 24}}>
                <Typography.Title level={4} style={{color: token.colorText, margin: 0, fontSize: 18}}>
                    {t('brand')}
                </Typography.Title>
            </Link>
            <Flex style={{flexGrow: 1, minWidth: 0}} justify='stretch' align="center">
                <Menu mode="horizontal" items={leftItems} selectedKeys={selectedKeys} style={{flexGrow: 1}}/>
                <HeaderActions/>
            </Flex>
        </Header>
    )
}

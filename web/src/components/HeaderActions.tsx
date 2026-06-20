import {Flex} from 'antd'
import {LanguageMenu} from './LanguageMenu'
import {ThemeMenu} from './ThemeMenu'
import {UserMenu} from './UserMenu'

export function HeaderActions() {
    return (
        <Flex align="center" style={{minWidth: 0, marginLeft: 'auto'}}>
            <ThemeMenu/>
            <LanguageMenu/>
            <UserMenu/>
        </Flex>
    )
}

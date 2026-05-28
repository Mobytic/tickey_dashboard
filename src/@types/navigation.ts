import {UserRole} from './auth'

export interface NavigationTree {
    key: string
    path: string
    isExternalLink?: boolean
    title: string
    icon: string
    type: 'title' | 'collapse' | 'item'
    authority: UserRole[]
    subMenu: NavigationTree[]
}

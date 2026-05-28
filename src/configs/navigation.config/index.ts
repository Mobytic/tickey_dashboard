import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import {UserRole} from '@/@types/auth'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'ticketsGroup',
        path: '',
        title: 'Tickets',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'ticketsGroup.list',
                path: '/tickets',
                title: 'Liste tickets',
                icon: 'list',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ticketsGroup.create',
                path: '/tickets/create',
                title: 'Créer un ticket',
                icon: 'ticketAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            
        ],
    },
    {
        key: 'userGroup',
        path: '',
        title: 'Utilisateurs',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [UserRole.admin],
        subMenu: [
            {
                key: 'userGroup.list',
                path: '/users',
                title: 'Liste utilisateurs',
                icon: 'list',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'userGroup.create',
                path: '/users/create',
                title: 'Créer un utilisateur',
                icon: 'userAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            
        ],
    },
    {
        key: 'paramGroup',
        path: '',
        title: 'Maintenance',
        icon: 'cog',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [UserRole.admin],
        subMenu: [
            {
                key: 'paramGroup.nametag',
                path: '/param/nametag',
                title: 'Gérer les nametags',
                icon: 'nametag',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            }, 
            {
                key: 'paramGroup.status',
                path: '/param/status',
                title: 'Gérer les statuts',
                icon: 'status',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            }, 
            {
                key: 'paramGroup.category',
                path: '/param/category',
                title: 'Gérer les catégories',
                icon: 'category',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },         
        ],
    },
]

export default navigationConfig

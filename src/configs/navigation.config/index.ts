import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

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
        key: 'kanban',
        path: '/single-menu-view',
        title: 'Kanban',
        icon: 'kanban',
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
        authority: [],
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
        title: 'Paramètres',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'paramGroup.index',
                path: '/param',
                title: 'Créer, modifier, supprimer',
                icon: 'computer',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },         
        ],
    },
]

export default navigationConfig

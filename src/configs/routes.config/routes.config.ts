import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'ticketsGroup.list',
        path: '/tickets',
        component: lazy(() => import('@/views/ticket/TicketIndex')),
        authority: [],
    },
    {
        key: 'ticketsGroup.create',
        path: '/tickets/create',
        component: lazy(() => import('@/views/ticket/TicketForm')),
        authority: [],
    },
    {
        key: 'userGroup.list',
        path: '/users',
        component: lazy(() => import('@/views/auth/index/Index')),
        authority: [],
    },
    {
        key: 'userGroup.create',
        path: '/users/create',
        component: lazy(() => import('@/views/auth/SignUp/SignUp')),
        authority: [],
    },
    {
        key: 'paramGroup.nametag',
        path: '/param/nametag',
        component: lazy(() => import('@/views/nametag/Nametag')),
        authority: [],
    },
    {
        key: 'paramGroup.status',
        path: '/param/status',
        component: lazy(() => import('@/views/status/Status')),
        authority: [],
    },
    {
        key: 'paramGroup.category',
        path: '/param/category',
        component: lazy(() => import('@/views/category/Category')),
        authority: [],
    },
    
    
]
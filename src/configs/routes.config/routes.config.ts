import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import { UserRole } from '@/@types/auth'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [UserRole.admin],
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
        component: lazy(() => import('@/views/ticket/TicketCreation')),
        authority: [],
    },
    {
        key: 'userGroup.list',
        path: '/users',
        component: lazy(() => import('@/views/auth/index/Index')),
        authority: [UserRole.admin],
    },
    {
        key: 'userGroup.create',
        path: '/users/create',
        component: lazy(() => import('@/views/auth/SignUp/SignUp')),
        authority: [UserRole.admin],
    },
    {
        key: 'paramGroup.nametag',
        path: '/param/nametag',
        component: lazy(() => import('@/views/nametag/Nametag')),
        authority: [UserRole.admin],
    },
    {
        key: 'paramGroup.status',
        path: '/param/status',
        component: lazy(() => import('@/views/status/Status')),
        authority: [UserRole.admin],
    },
    {
        key: 'paramGroup.category',
        path: '/param/category',
        component: lazy(() => import('@/views/category/Category')),
        authority: [UserRole.admin],
    },
    {
        path: '*',
        component: lazy(() => import('@/views/page/NotFound')),
        authority: [],
    },
    {
        key: 'accessDenied',
        path: '/access-denied',
        component: lazy(() => import('@/views/auth/AccessDenied')),
        authority: [],
    },
    
    
]
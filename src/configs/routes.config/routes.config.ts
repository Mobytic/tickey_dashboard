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
        component: lazy(() => import('@/views/ticket/TicketCreate')),
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
        key: 'paramGroup.index',
        path: '/param',
        component: lazy(() => import('@/views/param/Param')),
        authority: [],
    },
    
    
]
import type { Category } from './category'
import type { TicketStatus } from './ticketStatus'
import type { Nametag } from './nametag'
import type { Website } from './website'


export type Ticket = {
    id: number
    title: string
    bugLink: string              
    clientComment: string        
    teamComment: string | null
    mailComment: string | null 
    userId: number
    categoryId: number
    ticketStatusId: number
    websiteId: number
    createdAt: string
    updatedAt: string
    archivedAt: string | null

    category?: Category
    status?: TicketStatus
    website?: Website      
    nametags?: Nametag[]  
    user?: {
        firstname: string
        lastname: string
        mail: string
        tel: string
        drivePath: string
        url: string
        urls?: Website[]
    }
}

export type TicketRequest = {
    title: string
    bugLink: string
    clientComment: string
    teamComment?: string
    mailComment?: string
    categoryId: number
    websiteId: number
    statusId?: number    
    nametagIds?: number[]
}

export type TicketResponse = {
    message: string
    ticket: Ticket
}

export type TicketListResponse = Ticket[]
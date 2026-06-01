import type { Category } from './category'
import type { TicketStatus } from './ticketStatus'
import type { Nametag } from './nametag'

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
    createdAt: string
    updatedAt: string
    archivedAt: string | null

    category?: Category
    status?: TicketStatus      
    nametags?: Nametag[]  
    user?: {
        firstname: string
        lastname: string
        mail: string
    }
}

export type TicketRequest = {
    title: string
    bugLink: string
    clientComment: string
    categoryId: number
    statusId?: number    
    nametagIds?: number[]
}

export type TicketResponse = {
    message: string
    ticket: Ticket
}

export type TicketListResponse = Ticket[]
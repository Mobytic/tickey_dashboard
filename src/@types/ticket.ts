export type Ticket = {
    id: number
    title: string
    description: string
    status: number
    userId: number
    createdAt: string
    updatedAt: string
    websites?: {
        id: number
        url: string
    }[]
}

export type CreateTicketRequest = {
    title: string
    description: string
    websiteIds?: number[]
}

export type TicketResponse = {
    message: string
    ticket: Ticket
}

export type TicketListResponse = Ticket[]
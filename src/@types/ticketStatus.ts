export type TicketStatus = {
    id: number
    name: string
    color?: string
}

export type TicketStatusRequest = {
    name: string
    color?: string
}

export type TicketStatusResponse = {
    message: string
    ticketStatus: TicketStatus
}

export type TicketStatusListResponse = TicketStatus[]
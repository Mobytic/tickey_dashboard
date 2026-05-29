export type TicketStatus = {
    id: number
    name: string
}

export type TicketStatusRequest = {
    id?: number
    name: string
}

export type TicketStatusResponse = {
    message: string
    ticketStatus: TicketStatus
}

export type TicketStatusListResponse = TicketStatus[]
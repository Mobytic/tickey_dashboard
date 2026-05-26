export type TicketStatus = {
    id: number
    label: string
    color?: string
    createdAt: string
    updatedAt: string
}

export type TicketStatusRequest = {
    label: string
    color?: string
}

export type TicketStatusResponse = {
    message: string
    ticketStatus: TicketStatus
}

export type TicketStatusListResponse = TicketStatus[]
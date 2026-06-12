import ApiService from './ApiService'
import type {
    TicketStatusRequest,
    TicketStatusResponse,
    TicketStatusListResponse
} from '@/@types/ticketStatus'
import type { MessageResponse } from '@/@types/common'

export async function apiTicketStatusIndex() {
    return ApiService.fetchData<TicketStatusListResponse>({
        url: 'ticketStatus',
        method: 'get',
    })
}

export async function apiTicketStatusCreate(data: TicketStatusRequest) {
    return ApiService.fetchData<TicketStatusResponse>({
        url: 'ticketStatus/create',
        method: 'post',
        data,
    })
}

export async function apiTicketStatusUpdate(id: number, data: TicketStatusRequest) {
    return ApiService.fetchData<TicketStatusResponse>({
        url: `ticketStatus/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiTicketStatusDelete(id: number) {
    return ApiService.fetchData<MessageResponse>({
        url: `ticketStatus/${id}`,
        method: 'delete',
    })
}
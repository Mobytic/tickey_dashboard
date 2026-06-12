import ApiService from './ApiService'
import type {
    TicketRequest,
    TicketResponse,
    TicketListResponse,
} from '@/@types/ticket'

export async function apiTicketIndex() {
    return ApiService.fetchData<TicketListResponse>({
        url: 'tickets',
        method: 'get',
    })
}

export async function apiTicketCreate(data: TicketRequest) {
    return ApiService.fetchData<TicketResponse>({
        url: 'tickets/create',
        method: 'post',
        data,
    })
}

export async function apiTicketUpdate(id: number, data: TicketRequest) {
    return ApiService.fetchData<TicketResponse>({
        url: `tickets/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiTicketShow(id: number) {
    return ApiService.fetchData<TicketResponse>({
        url: `tickets/${id}`,
        method: 'get',
    })
}


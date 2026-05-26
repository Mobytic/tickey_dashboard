import ApiService from './ApiService'
import type {
    NametagRequest,
    NametagResponse,
    NametagListResponse
} from '@/@types/nametag'
import type { MessageResponse } from '@/@types/common'

export async function apiNametagIndex() {
    return ApiService.fetchData<NametagListResponse>({
        url: 'nametag',
        method: 'get',
    })
}

export async function apiNametagCreate(data: NametagRequest) {
    return ApiService.fetchData<NametagResponse>({
        url: 'nametag/create',
        method: 'post',
        data,
    })
}

export async function apiNametagUpdate(id: number, data: NametagRequest) {
    return ApiService.fetchData<NametagResponse>({
        url: `nametag/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiNametagDelete(id: number) {
    return ApiService.fetchData<MessageResponse>({
        url: `nametag/${id}`,
        method: 'delete',
    })
}
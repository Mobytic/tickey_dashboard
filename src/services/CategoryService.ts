import ApiService from './ApiService'
import type {
    Category,
    CategoryRequest,
    CategoryResponse,
    CategoryListResponse
} from '@/@types/category'
import type { MessageResponse } from '@/@types/common'


export async function apiCategoryIndex() {
    return ApiService.fetchData<CategoryListResponse>({
        url: 'category',
        method: 'get',
    })
}

export async function apiCategoryCreate(data: CategoryRequest) {
    return ApiService.fetchData<CategoryResponse>({
        url: 'category/create',
        method: 'post',
        data,
    })
}

export async function apiCategoryUpdate(id: number, data: CategoryRequest) {
    return ApiService.fetchData<CategoryResponse>({
        url: `category/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiCategoryDelete(id: number) {
    return ApiService.fetchData<MessageResponse>({
        url: `category/${id}`,
        method: 'delete',
    })
}
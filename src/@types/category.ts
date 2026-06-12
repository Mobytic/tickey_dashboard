export type Category = {
    id: number
    name: string
}

export type CategoryRequest = {
    id?: number
    name: string
}

export type CategoryResponse = {
    message: string
    category: Category
}

export type CategoryListResponse = Category[]
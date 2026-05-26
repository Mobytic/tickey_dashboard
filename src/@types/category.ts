export type Category = {
    id: number
    label: string
    createdAt: string
    updatedAt: string
}

export type CategoryRequest = {
    label: string
}

export type CategoryResponse = {
    message: string
    category: Category
}

export type CategoryListResponse = Category[]
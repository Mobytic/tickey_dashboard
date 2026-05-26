export type Nametag = {
    id: number
    label: string
    createdAt: string
    updatedAt: string
}

export type NametagRequest = {
    label: string
}

export type NametagResponse = {
    message: string
    nametag: Nametag
}

export type NametagListResponse = Nametag[]
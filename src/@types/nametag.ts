export type Nametag = {
    id: number
    name: string
    color: string
}

export type NametagRequest = {
    id?: number
    name: string
    color: string
}

export type NametagResponse = {
    message: string
    nametag: Nametag
    color: string
}

export type NametagListResponse = Nametag[]
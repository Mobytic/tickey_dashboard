export type Nametag = {
    id: number
    name: string
}

export type NametagRequest = {
    name: string
}

export type NametagResponse = {
    message: string
    nametag: Nametag
}

export type NametagListResponse = Nametag[]
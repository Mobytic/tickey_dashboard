export type Website = {
    id: number
    url: string
}

export type WebsiteRequest = {
    id?: number
    url: string
}

export type WebsiteResponse = {
    message: string
    website: Website
}

export type WebsiteListResponse = Website[]
export interface Data {
    data: any,
    error: any
}

export interface MediaType {
    media: 'img' | 'video',
    ext: string,
    mime: string
}

export interface ResizedMedia {
    buffer: Buffer,
    mime: string
}
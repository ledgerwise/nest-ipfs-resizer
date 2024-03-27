import { FitEnum } from 'sharp'

export type MediaType = 
    | 'image'
    | 'video'
    | 'audio'

export interface ImageOptions {
    width: number,
    height: number,
    format: string,
    background?: string
    fit?: keyof FitEnum,
    withoutEnlargement?: boolean
}

export interface VideoOptions {
    width: number,
    height: number,
    format: string,
    background?: string
    noAudio?: boolean,
    aspectRatio?: string,
    duration?: number,
    stream?: boolean
}

export interface AudioOptions {
    format: string,
}

export type MediaOptions =
    & ImageOptions
    & VideoOptions
    & AudioOptions

export type ResizeOptions = Omit<MediaOptions, 'format'> & {
    cId: string,
    format?: string
}

export interface ResizeBaseOptions {
    cId: string,
    buffer: ArrayBuffer
}

export interface ResizeImageOptions extends ImageOptions, ResizeBaseOptions {}

export interface ResizeVideoOptions extends VideoOptions, ResizeBaseOptions {}

export interface GetResizedFilePathBaseProps {
    cId: string,
    format: string
}

export interface GetResizedImageFilePathProps extends ImageOptions, GetResizedFilePathBaseProps {}

export interface GetResizedVideoFilePathProps extends VideoOptions, GetResizedFilePathBaseProps {}

export type GetResizedFilePath = 
    | GetResizedImageFilePathProps
    | GetResizedVideoFilePathProps

export interface GetResizedFileBaseProps {
    cId: string,
    format?: string
}

export interface GetResizedImageExistsProps extends Omit<ImageOptions, 'format'>, GetResizedFileBaseProps {}

export interface GetResizedVideoExistsProps extends Omit<VideoOptions, 'format'>, GetResizedFileBaseProps {}

export type GetFileExistsProps = 
    | GetResizedImageExistsProps
    | GetResizedVideoExistsProps

export type GetOriginalFileRes = Promise<{
    contentType: string,
    mediaType: MediaType,
    data: ArrayBuffer
}>    

export type ResizeRes = Promise<{
    resized: false,
    data: ArrayBuffer
} | {
    resized: true,
    path: string
}>

export interface FileExistsRes {
    exists: boolean,
    path: string
}
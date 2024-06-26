import { FitEnum } from 'sharp'

export type MediaType = 
    | 'image'
    | 'video'
    | 'audio'

export interface ImageOptions {
    width?: number,
    height?: number,
    format: string,
    background?: string
    fit?: keyof FitEnum,
    withoutEnlargement?: boolean,
    animated?: boolean
}

export interface VideoOptions {
    width?: number,
    height?: number,
    format: string,
    background?: string
    noAudio?: boolean,
    aspectRatio?: string,
    duration?: number,
    stream?: boolean
}

export interface AudioOptions {
    format: string,
    duration?: number
}

export type MediaOptions =
    & ImageOptions
    & VideoOptions
    & AudioOptions

export type ResizeOptions = Omit<MediaOptions, 'format'> & {
    cId: string,
    format?: string,
    onError?: string
}

export interface ResizeBaseOptions {
    cId: string,
    buffer: ArrayBuffer
}

export interface ResizeImageOptions extends ImageOptions, ResizeBaseOptions {}

export interface ResizeVideoOptions extends VideoOptions, ResizeBaseOptions {}

export interface ResizeAudioOptions extends AudioOptions, ResizeBaseOptions {}

export interface GetResizedFilePathBaseProps {
    cId: string,
    format: string
}

export interface GetResizedImageFilePathProps extends ImageOptions, GetResizedFilePathBaseProps {}

export interface GetResizedVideoFilePathProps extends VideoOptions, GetResizedFilePathBaseProps {}

export interface GetResizedAudioFilePathProps extends AudioOptions, GetResizedFilePathBaseProps {}

export type GetResizedFilePath = 
    | GetResizedImageFilePathProps
    | GetResizedVideoFilePathProps
    | GetResizedAudioFilePathProps

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
    data: ArrayBuffer
}>    

export type ResizeRes = Promise<{
    resized: false
} | {
    resized: true,
    path: string
}>

export interface FileExistsRes {
    exists: boolean,
    path: string
}
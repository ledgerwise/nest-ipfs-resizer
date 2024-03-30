import { AudioOptions, ImageOptions, VideoOptions } from "./interface";

export const AllowedImageOptions: Array<keyof ImageOptions> = [
    'background',
    'fit',
    'format',
    'height',
    'width',
    'withoutEnlargement',
    'animated'
]

export const AllowedVideoOptions: Array<keyof VideoOptions> = [
    'aspectRatio',
    'background',
    'duration',
    'format',
    'height',
    'width',
    'noAudio',
    'stream'
]

export const AllowedAudioOptions: Array<keyof AudioOptions> = [
    'duration',
    'format'
]

export const ValidResizeOptions = {
    image: AllowedImageOptions,
    video: AllowedVideoOptions,
    audio: AllowedAudioOptions
}

export enum FitEnumSwagger {
    contain = 'contain',
    cover = 'conver',
    fill = 'fill',
    inside = 'inside',
    outside = 'outside'
}
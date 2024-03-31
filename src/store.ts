import { AudioOptions, ImageOptions, VideoOptions } from "./interface";
import { config } from 'dotenv'

config();

const EnvSizeOptions = process.env.SIZE_OPTIONS
const EnvAspectOptions = process.env.ASPECT_OPTIONS
const EnvBackgroundOptions = process.env.BACKGROUND_OPTIONS
const EnvDurationOptions = process.env.DURATION_OPTIONS

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

export const SizeOptions: string[] | undefined = EnvSizeOptions
    ? EnvSizeOptions.split(',')
    : undefined

export const AspectOptions: string[] | undefined = EnvAspectOptions
    ? EnvAspectOptions.split(',')
    : undefined

export const BackgroundOptions: string[] | undefined = EnvBackgroundOptions
    ? EnvBackgroundOptions.split(',')
    : undefined

export const DurationOptions: string[] | undefined = EnvDurationOptions
    ? EnvDurationOptions.split(',')
    : undefined
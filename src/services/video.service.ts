import { Injectable } from '@nestjs/common'
import * as ffmpegStatic from 'ffmpeg-static'
import * as ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'
import { HelperService } from './helpers.service'
import { ResizeVideoOptions } from 'src/interface'

@Injectable()
export class VideoService {
    constructor(
        private readonly helperService: HelperService
    ) {}

    async resizeVideo({ 
        buffer, 
        ...rest
    }: ResizeVideoOptions): Promise<void> {

        const filePath = this.helperService.getResizedFilePath(rest)

        ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string)

        const { cId, format, width, height, noAudio, 
            aspectRatio, background, duration } = rest

        this.helperService.createFolders(cId)

        return new Promise((res, rej) => {
            let command = ffmpeg()
                .input(Readable.from(Buffer.from(buffer)))
                .size(`${width}x${height}`)

            if (noAudio) {
                command = command.noAudio()
            }

            if (aspectRatio) {
                command = command.aspectRatio(aspectRatio)
            }

            if (background) {
                command = command.autoPad(undefined, background)
            }

            if (duration) {
                command = command.duration(duration)
            }

            command
                // .videoCodec('libx264')
                // .addOption('-x264opts', 'keyint=24:min-keyint=24:no-scenecut')
                // .format('dash')
                .toFormat(format)
                .output(filePath)
                .on('end', () => {
                    res()
                })
                .on('error', (err) => {
                    rej(new Error(err))
                })
                .run()
        })
    }
}
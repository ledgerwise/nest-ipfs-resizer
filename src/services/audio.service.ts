import { Injectable } from '@nestjs/common'
import * as ffmpegStatic from 'ffmpeg-static'
import * as ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'
import { HelperService } from './helpers.service'
import { ResizeAudioOptions } from 'src/interface'

@Injectable()
export class AudioService {
    constructor(
        private readonly helperService: HelperService
    ) {}

    async resizeAudio({ 
        buffer, 
        ...rest
    }: ResizeAudioOptions): Promise<void> {

        const filePath = this.helperService.getResizedFilePath(rest)

        ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string)

        const { cId, format, duration } = rest

        this.helperService.createFolders(cId)

        return new Promise((res, rej) => {
            let command = ffmpeg()
                .input(Readable.from(Buffer.from(buffer)))

            if (duration) {
                command = command.duration(duration)
            }

            command
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
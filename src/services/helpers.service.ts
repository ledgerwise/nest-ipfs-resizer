import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { FileExistsRes, GetFileExistsProps, GetResizedFilePath, MediaType } from 'src/interface'
import  * as fs from 'fs'
import { ValidResizeOptions } from 'src/store'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HelperService {

    private readonly configService = new ConfigService()

    readonly DEFAULT_IMG_FORMAT = this.configService.get('DEFAULT_IMG_FORMAT') || 'webp'
    readonly DEFAULT_VIDEO_FORMAT= this.configService.get('DEFAULT_VIDEO_FORMAT') || 'webm'  
    readonly DEFAULT_AUDIO_FORMAT = this.configService.get('DEFAULT_AUDIO_FORMAT') || 'webm'

    getResizedFilePath({
        cId,
        format,
        ...rest
    }: GetResizedFilePath) {

        const extra = Object.entries(rest).reduce((p, c) => {
            if (!c[1]) {
                return p
            }

            return p + (p ? '-' : '') + (c[0] + '=' + c[1])
        }, '')

        return join(process.cwd() + '/resized/' + cId + (extra ? '-' : '') + extra + '.' + format)
    }

    createFolders(cId: string) {
        const root = process.cwd()
        const resizedF = root + '/resized'

        if (!fs.existsSync(resizedF)) {
            fs.mkdirSync(resizedF)
        }

        if (cId.includes('/')) {
            const folders = cId.split('/')

            for (let i = 0; i < (folders.length - 1); i++) {
                const path = resizedF + '/' + folders.slice(0, (i + 1)).join('/')

                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path)
                }
            }
        }
    }

    resizedFileExists({
        cId,
        format,
        ...rest
    }: GetFileExistsProps): FileExistsRes {
        if (format) {
            const path = this.getResizedFilePath({
                cId,
                format,
                ...rest
            })
            const exists = fs.existsSync(path)

            return {
                exists,
                path
            }
        }

        const cases: MediaType[] = ['audio', 'image', 'video']

        for (const c of cases) {
            const f = c === 'image'
                ? this.DEFAULT_IMG_FORMAT
                : c === 'video'
                    ? this.DEFAULT_VIDEO_FORMAT
                    : this.DEFAULT_AUDIO_FORMAT

            const path = this.getResizedFilePath({
                cId,
                format: f,
                ...rest
            })
            const exists = fs.existsSync(path)

            if (exists) {
                return {
                    exists: true,
                    path
                };
            }
        }

        return {
            exists: false,
            path: ''
        };
    }

    getMediaType(contentType: string): MediaType | null {
        if (contentType.includes('image')) {
            return 'image'
        } else if (contentType.includes('video')) {
            return 'video'
        } else if (contentType.includes('audio')) {
            return 'audio'
        } else {
            return null;
        }
    }
}
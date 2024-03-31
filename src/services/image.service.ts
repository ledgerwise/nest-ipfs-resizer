import { Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import { ResizeImageOptions } from 'src/interface'
import { HelperService } from './helpers.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ImageService {
    constructor(
        private readonly helperService: HelperService
    ) {}

    private readonly configService = new ConfigService()
    private readonly DEFAULT_ANIMATED = this.configService.get('DEFAULT_IMG_ANIM') === 'true' ? true : false
    private readonly DEFAULT_FIT = this.configService.get('DEFAULT_IMG_FIT') || 'contain'

    async resizeImage({ 
        buffer, 
        ...rest
    }: ResizeImageOptions) {
        const filePath = this.helperService.getResizedFilePath(rest)

        const { cId, format, background, animated = this.DEFAULT_ANIMATED,
            width, height, fit = this.DEFAULT_FIT, withoutEnlargement } = rest

        this.helperService.createFolders(cId)
        
        await sharp(buffer, {
                animated,
            })
            .resize(width, height, {
                fit,
                withoutEnlargement,
                background,
            })
            .toFormat(format as keyof sharp.FormatEnum)
            .keepMetadata()
            .toFile(filePath)
    }
}
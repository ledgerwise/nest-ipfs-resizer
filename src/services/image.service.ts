import { Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import { ResizeImageOptions } from 'src/interface'
import { HelperService } from './helpers.service'

@Injectable()
export class ImageService {
    constructor(
        private readonly helperService: HelperService
    ) {}

    // extend, composite

    async resizeImage({ 
        buffer, 
        ...rest
    }: ResizeImageOptions) {
        const filePath = this.helperService.getResizedFilePath(rest)

        const { cId, format, background,
            width, height, fit, withoutEnlargement } = rest

        this.helperService.createFolders(cId)
        
        await sharp(buffer, {
                animated: true
            })
            .resize(width, height, {
                fit,
                withoutEnlargement,
                background
            })
            .toFormat(format as keyof sharp.FormatEnum)
            .keepMetadata()
            .toFile(filePath)
    }
}
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ResizedMedia } from './interfaces/resizer.interface';
import { ResizerService } from './resizer.service';

@Controller('resizer')
export class ResizerController {

    constructor (private readonly resizerService: ResizerService) {}

    @Get(':hash(*)')
    async resize(@Param() params, @Res() res) {

        const hash: string | undefined = params.hash;

        const resMedia: ResizedMedia 
            = await this.resizerService.resize(hash);
        
        res.writeHead(HttpStatus.OK, {
            'Content-Type': resMedia.mime
        })
        res.end(resMedia.buffer);
    }
}
import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { AppService } from './services/app.service';
import { Response } from 'express';
import { FitEnum } from 'sharp'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ipfs/:cId(*)')
  async resize(
    @Res() resp: Response,
    @Param('cId') cId: string,
    @Query('width') width: string,
    @Query('height') height: string,
    @Query('fit') fit?: keyof FitEnum,
    @Query('without_enlargement') withoutEnlargement?: boolean,
    @Query('format') format?: string,
    @Query('no_audio') noAudio?: boolean,
    @Query('aspect_ratio') aspectRatio?: string,
    @Query('background') background?: string,
    @Query('duration') duration?: number
  ) {
    
    const res = await this.appService.resize({
      cId,
      width: Number(width),
      height: Number(height),
      fit,
      withoutEnlargement,
      format,
      noAudio,
      aspectRatio,
      background,
      duration
    })

    if (res.resized === false) {
      resp.set({
        'Content-Length': res.data.byteLength
      })
      resp.send(res.data)
      return;
    }

    resp.sendFile(res.path)
  }
}

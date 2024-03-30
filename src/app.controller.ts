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
    @Query('without_enlargement') withoutEnlargement?: string,
    @Query('format') format?: string,
    @Query('animated') animated?: string,
    @Query('no_audio') noAudio?: string,
    @Query('aspect_ratio') aspectRatio?: string,
    @Query('background') background?: string,
    @Query('duration') duration?: string,
    @Query('on_error') onError?: string
  ) {
    
    const res = await this.appService.resize({
      cId,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
      fit,
      withoutEnlargement: withoutEnlargement ? Boolean(withoutEnlargement) : undefined,
      format,
      noAudio: noAudio ? Boolean(noAudio) : undefined,
      aspectRatio,
      background,
      duration: duration ? Number(duration) : undefined,
      animated: animated ? Boolean(animated) : undefined,
      onError
    })

    if (res.resized === false) {
      console.log(onError)
      if (onError) resp.redirect(onError)
      return;
    }

    resp.sendFile(res.path)
  }
}

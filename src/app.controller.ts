import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { AppService } from './services/app.service';
import { Response } from 'express';
import { ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { FitEnum } from 'sharp';
import { AspectOptions, BackgroundOptions, DurationOptions, FitEnumSwagger, SizeOptions } from './store';
import { ValidateService } from './services/validate.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly validateService: ValidateService
  ) {}

  /**
   * When options are provided via environment variables, 
   * any value outside the permitted range is not allowed. 
   * However, 'undefined' is acceptable for all options.
   */

  @ApiResponse({
    status: 200,
    description: 'The IPFS file has been successfully resized.',
    content: {
      'video/*': {},
      'image/*': {},
      // 'audio/*': {}
    }
  })
  @ApiResponse({
    status: 500,
    description: 'The IPFS file could not be resized.',
    content: {
      'application/json': {}
    }
  })
  @ApiParam({
    name: 'cId',
    type: String,
    required: true,
    description: 'The cId of an IPFS file uniquely describing the block.'
  })
  @ApiQuery({
    name: 'format',
    type: String,
    required: false,
    description: 'Force output to a given format. By default the resizer will use webp for image and webm for video and audio.'
  })
  @ApiQuery({
    name: 'size',
    type: String,
    enum: SizeOptions,
    required: SizeOptions ? true : false,
    description: 'The resolution of the resized file. Ignored if provider does not provide allowed size options. (Only works for video and image.)'
  })
  @ApiQuery({
    name: 'width',
    type: String,
    required: false,
    description: 'The desired width of the resized file. Ignored if provider provides size options. (Only works for video and image.)'
  })
  @ApiQuery({
    name: 'height',
    type: String,
    required: false,
    description: 'The desired height of the resized file. Ignored if provider provides size options. (Only works for video and image.)'
  })
  @ApiQuery({
    name: 'fit',
    type: String,
    required: false,
    enum: FitEnumSwagger,
    description: 'How the image should be resized to fit both provided dimensions. By default contain will be used as the fit. (Only works for image.)'
  })
  @ApiQuery({
    name: 'animated',
    type: Boolean,
    required: false,
    description: 'If set to false, the output image will be non-animated. Default value is false. (Only works for image.)'
  })
  @ApiQuery({
    name: 'without_enlargement',
    type: Boolean,
    required: false,
    description: 'Do not enlarge if the width or height are already less than the specified dimensions. (Only works for image.)'
  })
  // @ApiQuery({
  //   name: 'aspect_ratio',
  //   enum: AspectOptions,
  //   type: String,
  //   required: false,
  //   description: 'Enforces a specific output aspect ratio. It is ignored if both width and height are provided or none is provided. eg: 4:3 (Only works for video.)'
  // })
  // @ApiQuery({
  //   name: 'duration',
  //   enum: DurationOptions,
  //   type: String,
  //   required: false,
  //   description: 'Forces to stop transcoding after a specific output duration. Accepts value in seconds. eg: 30 (Only works for video and audio.)'
  // })
  // @ApiQuery({
  //   name: 'no_audio',
  //   type: Boolean,
  //   required: false,
  //   description: 'Disables audio in the output. (Only works for video.)'
  // })
  @ApiQuery({
    name: 'background',
    enum: BackgroundOptions,
    type: String,
    required: false,
    description: 'Background color of the media. Eg: Teal (Only works for video and image.)'
  })
  // @ApiQuery({
  //   name: 'on_error',
  //   type: String,
  //   required: false,
  //   description: 'URL to redirect to in case resizing fails. This is helpful for dapps to redirect to an unresized source in case of an error.\n\nExample: https://ipfs.io/ipfs/QmUkRt94GkTDUa2tTgTCDAm7xne2xYTpzSQizw5mJPf61y/base/4a.jpg'
  // })
  @Get('/ipfs/:cId(*)')
  async resize(
    @Res() resp: Response,
    @Param('cId') cId: string,
    @Query('format') format?: string,
    @Query('size') size?: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('fit') fit?: keyof FitEnum,
    @Query('animated') animated?: string,
    @Query('without_enlargement') withoutEnlargement?: string,
    // @Query('aspect_ratio') aspectRatio?: string,
    // @Query('duration') duration?: string,
    // @Query('no_audio') noAudio?: string,
    @Query('background') background?: string,
    // @Query('on_error') onError?: string
  ) {
    const { w, h } = this.validateService.validateQuerySize(size, width, height)
    // const aspect = this.validateService.validateQueryAspect(aspectRatio)
    // const d = this.validateService.validateQueryDuration(duration)
    const b = this.validateService.validateQueryBackground(background)
    
    const res = await this.appService.resize({
      cId,
      width: w,
      height: h,
      fit,
      withoutEnlargement: withoutEnlargement === 'true' ? true : undefined,
      format,
      // noAudio: noAudio === 'true' ? true : undefined,
      // aspectRatio: aspect,
      background: b,
      // duration: d,
      animated: animated === 'true' ? true : undefined,
      // onError
    })

    if (res.resized === false) {
      // if (onError) resp.redirect(onError)
      return;
    }

    resp.sendFile(res.path)
  }
}

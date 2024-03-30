import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetOriginalFileRes, ResizeOptions, ResizeRes } from '../interface';
import ffmpegStatic from 'ffmpeg-static'
import * as ffmpeg from 'fluent-ffmpeg'
import { ImageService } from './image.service';
import { VideoService } from './video.service';
import { HelperService } from './helpers.service';
import * as fs from 'fs'
import { AudioService } from './audio.service';

ffmpeg.setFfmpegPath(ffmpegStatic as string)

@Injectable()
export class AppService {
  constructor(
    private readonly imageService: ImageService,
    private readonly videoService: VideoService,
    private readonly audioService: AudioService,
    private readonly helperService: HelperService
  ) { }

  private readonly configService = new ConfigService()

  async getOriginalFile(cId: string): GetOriginalFileRes {
    const ipfsGateway = this.configService.get('IPFS_GATEWAY')

    if (!ipfsGateway) {
      throw new Error('IPFS Gateway not present.')
    }

    const resp = await axios.get(`${ipfsGateway}/ipfs/${cId}`, {
      responseType: 'arraybuffer'
    })

    const data = resp.data

    const contentType = resp.headers['content-type']

    return {
      contentType,
      data
    };
  }

  getResizeOptions(props: ResizeOptions) {
    const {
      cId,
      onError,
      ...resizeProps
    } = props

    return resizeProps;
  }

  async manageImage(buffer: ArrayBuffer, props: ResizeOptions) {
    const resizeProps = this.getResizeOptions(props)

    const hasValidOpts = this.helperService.validateResizeOptions('image', resizeProps)

    if (!hasValidOpts) {
      throw new Error('Invalid resizing options for this media type!')
    }

    const f = props.format || this.helperService.DEFAULT_IMG_FORMAT

    const { cId, width, height, fit, background, animated, withoutEnlargement } = props

    const path = this.helperService.getResizedFilePath({
      cId,
      format: f,
      width,
      height,
      fit,
      background,
      animated,
      withoutEnlargement
    })

    await this.imageService.resizeImage({
      cId,
      format: f,
      buffer,
      width,
      height,
      fit,
      background,
      animated,
      withoutEnlargement
    })

    return path;
  }

  async manageVideo(buffer: ArrayBuffer, props: ResizeOptions) {
    const resizeProps = this.getResizeOptions(props)

    const hasValidOpts = this.helperService.validateResizeOptions('video', resizeProps)

    if (!hasValidOpts) {
      throw new Error('Invalid resizing options for this media type!')
    }

    const f = props.format || this.helperService.DEFAULT_VIDEO_FORMAT

    const { cId, width, height, noAudio, aspectRatio,
      background, duration } = props

    const path = this.helperService.getResizedFilePath({
      cId,
      format: f,
      width,
      height,
      noAudio,
      aspectRatio,
      background,
      duration
    })

    await this.videoService.resizeVideo({
      buffer,
      cId,
      format: f,
      width,
      height,
      noAudio,
      aspectRatio,
      background,
      duration
    })

    return path;
  }

  async manageAudio(buffer: ArrayBuffer, props: ResizeOptions) {
    const resizeProps = this.getResizeOptions(props)

    const hasValidOpts = this.helperService.validateResizeOptions('audio', resizeProps)

    if (!hasValidOpts) {
      throw new Error('Invalid resizing options for this media type!')
    }

    const f = props.format || this.helperService.DEFAULT_AUDIO_FORMAT

    const { cId, duration } = props

    const path = this.helperService.getResizedFilePath({
      cId,
      format: f,
      duration
    })

    await this.audioService.resizeAudio({
      buffer,
      cId,
      format: f,
      duration
    })

    return path;
  } 

  async resize({
    onError,
    ...props
  }: ResizeOptions): ResizeRes {
    try {
      if (!props.cId) {
        throw new Error('IPFS hash should not be empty!')
      }

      const { exists, path } = this.helperService.resizedFileExists(props)

      if (exists) {
        const mTime = new Date()

        fs.utimesSync(path, mTime, mTime)

        return {
          resized: true,
          path
        };
      }

      const orgResp = await this.getOriginalFile(props.cId)
      const orgBuffer = orgResp.data

      const mediaType = this.helperService.getMediaType(orgResp.contentType)

      if (mediaType === null) {
        throw new Error('Content must be a media type.')
      }

      let resizedPath = ''

      switch(mediaType) {
        case 'audio':
          resizedPath = await this.manageAudio(orgBuffer, props)
          break;

        case 'video':
          resizedPath = await this.manageVideo(orgBuffer, props)
          break;

        default:
          resizedPath = await this.manageImage(orgBuffer, props)
      }

      return {
        resized: true,
        path: resizedPath
      }
    } catch (error) {

      if (onError) {
        return {
          resized: false
        }
      }

      throw new HttpException(String(error), HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

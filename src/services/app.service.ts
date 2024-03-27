import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetOriginalFileRes, MediaOptions, ResizeOptions, ResizeRes } from '../interface';
import ffmpegStatic from 'ffmpeg-static'
import * as ffmpeg from 'fluent-ffmpeg'
import { ImageService } from './image.service';
import { VideoService } from './video.service';
import { HelperService } from './helpers.service';

ffmpeg.setFfmpegPath(ffmpegStatic as string)

@Injectable()
export class AppService {
  constructor(
    private readonly imageService: ImageService,
    private readonly videoService: VideoService,
    private readonly helperService: HelperService
  ) { }

  private readonly configService = new ConfigService()
  private readonly logger = new Logger()

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
    const mediaType = this.helperService.getMediaType(contentType)

    if (mediaType === null) {
      throw new Error('Content must be a media type.')
    }

    return {
      contentType,
      mediaType,
      data
    };
  }

  async resize(props: ResizeOptions): ResizeRes {
    try {
      if (!props.cId) {
        throw new Error('IPFS hash should not be empty!')
      }

      if (isNaN(props.width) || isNaN(props.height)) {
        throw new Error('Invalid Width and Height!')
      }

      const { exists, path } = this.helperService.fileExists(props)

      if (exists) {
        return {
          resized: true,
          path
        };
      }

      const orgResp = await this.getOriginalFile(props.cId)

      try {
        if (orgResp.mediaType === 'image') {
          const f = props.format || this.helperService.DEFAULT_IMG_FORMAT

          const { cId, width, height, fit, background, withoutEnlargement } = props

          const path = this.helperService.getResizedFilePath({
            cId,
            format: f,
            width,
            height,
            fit,
            background,
            withoutEnlargement
          })

          await this.imageService.resizeImage({
            cId,
            format: f,
            buffer: orgResp.data,
            width: width,
            height: height,
            fit,
            background,
            withoutEnlargement
          })

          return {
            resized: true,
            path
          }
        }

        if (orgResp.mediaType === 'video') {
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
            buffer: orgResp.data,
            cId,
            format: f,
            width,
            height,
            noAudio,
            aspectRatio,
            background,
            duration
          })

          return {
            resized: true,
            path
          }
        }

        return {
          resized: false,
          data: orgResp.data
        }
      } catch (error) {
        this.logger.error(String(error))

        return {
          resized: false,
          data: orgResp.data
        }
      }
    } catch (error) {
      throw new HttpException(String(error), HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

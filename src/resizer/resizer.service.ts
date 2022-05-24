import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { 
    BadRequestException, 
    Injectable, 
    InternalServerErrorException, 
    UnprocessableEntityException, 
    UnsupportedMediaTypeException 
} from '@nestjs/common';
import { 
    MediaType, 
    ResizedMedia 
} from './interfaces/resizer.interface';
import sharp = require("sharp");
import fetch from 'node-fetch';

const ffmpegInstance = createFFmpeg({ log: true });
ffmpegInstance.load();

@Injectable()
export class ResizerService {

    private readonly IPFS: string = 'https://ipfs.ledgerwise.io/ipfs';

    async resize(hash: string | undefined): Promise<ResizedMedia> {

        let res: ResizedMedia = {
            buffer: undefined,
            mime: ''
        }
    
        if (hash) {
    
            const mediaBuffer: Buffer = await this.downloadBuffer(hash);
    
            const buffer: Buffer = mediaBuffer;
                
            const fileType: MediaType = await this.checkFileType(buffer);
    
            res.mime = fileType.mime;

            if (fileType.media === 'img') {

                const resizedImg: Buffer 
                    = await this.resizeImage(buffer);

                res.buffer = resizedImg
            } else {

                const resizedVideo: Buffer    
                    = await this.resizeVideo(buffer, hash, 
                        fileType.ext);

                res.buffer = resizedVideo;
            }
        } else {
    
            throw new BadRequestException();
        }
    
        return res;
    }

    async bufferFetcher(url: string): Promise<ArrayBuffer> {
    
        const r = await fetch(url)
            .then((resp: Response) => resp.arrayBuffer())
            .catch((err: Error) => {

                throw new InternalServerErrorException();
            })
        
        return r;
    }
    
    async downloadBuffer(hash: string): Promise<Buffer> {
        
        const arrayBuffer: ArrayBuffer 
            = await this.bufferFetcher(`${this.IPFS}/${hash}`);
        
        if (arrayBuffer) {

            return Buffer.from(arrayBuffer);
        } else {

            throw new UnprocessableEntityException();
        }
    }
    
    async checkFileType(file: Buffer): Promise<MediaType> {
        
        const imgTypes: string[] = ['3g2', '3gp', '3mf', 'arw', 'avif',
            'bmp', 'bpg', 'cr2', 'cr3', 'cur', 'dcm', 'dng', 'icns', 'ico',
            'jp2', 'jpg', 'jpm', 'jpx', 'jxl', 'jxr', 'ktx', 'png',
            'tif', 'rw2', 'raf', 'orf', 'gif']
    
        const { fileTypeFromBuffer } 
            = await (eval('import("file-type")') as Promise<typeof import('file-type')>);
    
        const fileType = await fileTypeFromBuffer(file).catch(err => {
            throw new UnprocessableEntityException();
        });
    
        if (fileType) {
            
            const ext: string = fileType.ext;
    
            const mediaType: MediaType = {
                media: imgTypes.includes(ext) ? 'img': 'video',
                ext: ext,
                mime: fileType.mime
            }
        
            return mediaType;
        } else {
    
            throw new UnsupportedMediaTypeException();
        }
    }
    
    async resizeImage(file: Buffer): Promise<Buffer> {
    
        const w: number = 370;
        const h: number = 370;
        
        const resizedFile: Buffer | void = 
            await sharp(file, { failOnError: false })
                .resize(w, h, {
                    fit: 'inside',
                    withoutEnlargement: true
                }).toBuffer()
                .catch(err => {
                    
                    throw new InternalServerErrorException();
                });
    
        if (resizedFile) {
    
            return resizedFile;
        } else {
    
            throw new InternalServerErrorException();
        }
    } 
    
    async resizeVideo(file: Buffer, hash: string, 
            ext: string): Promise<Buffer> {
        
        if (ffmpegInstance.isLoaded()) {
    
            const inputFile: string = hash;
            const outputFile: string = `${hash}.${ext}`;
    
            try {
    
                ffmpegInstance.FS('writeFile', hash, file);
                await ffmpegInstance.run(
                    '-i',
                    inputFile,
                    '-vf',
                    'scale=360:trunc(ow/a/2)*2',
                    outputFile
                );
                
                const outputData: ArrayBuffer 
                    = ffmpegInstance.FS('readFile', outputFile);
                ffmpegInstance.FS('unlink', hash);
                ffmpegInstance.FS('unlink', outputFile);
    
                return Buffer.from(outputData);
            } catch (error) {
                
                throw new InternalServerErrorException();
            }
        } else {
    
            throw new InternalServerErrorException();
        }
    }
}

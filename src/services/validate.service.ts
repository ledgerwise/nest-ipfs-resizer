import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { MediaType } from "src/interface";
import { AspectOptions, BackgroundOptions, DurationOptions, SizeOptions, ValidResizeOptions } from "src/store";

@Injectable()
export class ValidateService {

    validateResizeOptions(mediaType: MediaType, options: Record<string, any>) {
        const validOptions = ValidResizeOptions[mediaType]

        for (const opt in options) {
            if (options[opt]) {

                if (!validOptions.includes(opt as any)) {
                    return false;
                }
            }
        }

        return true;;
    }

    validateQuerySize(size?: string, width?: string, height?: string) {
        let w: number | undefined = undefined
        let h: number | undefined = undefined

        if (SizeOptions) {
            if (size) {

                if (SizeOptions.includes(size)) {
                    const vals = size.split('x')

                    const providedW = Number(vals[0])
                    const providedH = Number(vals[1])

                    if (isNaN(providedW) || isNaN(providedH)) {
                        throw new HttpException('Invalid size!', HttpStatus.INTERNAL_SERVER_ERROR)
                    }

                    w = providedW
                    h = providedH
                } else {
                    throw new HttpException('Invalid size!', HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }
        } else {
            w = width ? Number(width) : undefined
            h = height ? Number(height) : undefined
        }

        return {
            w,
            h
        }
    }

    validateQueryAspect(aspectRatio?: string) {
        let aspect: string | undefined = undefined

        if (AspectOptions) {
            if (aspectRatio) {
                if (AspectOptions.includes(aspectRatio)) {
                    aspect = aspectRatio
                } else {
                    throw new HttpException('Invalid Aspect Ratio!', HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }
        } else {
            aspect = aspectRatio
        }

        return aspect
    }

    validateQueryDuration(duration?: string) {
        let d: number | undefined = undefined

        if (DurationOptions) {
            if (duration) {
                if (DurationOptions.includes(duration)) {
                    const providedD = Number(duration)

                    if (!isNaN(providedD)) {
                        d = providedD
                    } else {
                        throw new HttpException('Invalid Duration!', HttpStatus.INTERNAL_SERVER_ERROR)
                    }
                } else {
                    throw new HttpException('Invalid Duration!', HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }
        } else {
            d = duration ? Number(duration) : undefined
        }

        return d
    }

    validateQueryBackground(background?: string) {
        let b: string | undefined = undefined

        if (BackgroundOptions) {
            if (background) {
                if (BackgroundOptions.includes(background)) {
                    b = background
                } else {
                    throw new HttpException('Invalid Background!', HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }
        } else {
            b = background
        }

        return b;
    }
}
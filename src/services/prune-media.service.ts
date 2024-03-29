import { Injectable, Logger } from "@nestjs/common";
import { Cron } from '@nestjs/schedule'
import findRemoveSync = require("find-remove");
import { config } from 'dotenv'

config()

const defaultAge = 2592000
const pruneAge = process.env.PRUNE_AGE || defaultAge
const pruneCron = process.env.PRUNE_CRON_EXPRESSION || '0 0 * * 0'

@Injectable()
export class PruneMediaService {
    private readonly logger = new Logger(PruneMediaService.name)

    @Cron(pruneCron)
    handleTask() {
        try {
            const age = typeof pruneAge === 'string' 
                ? isNaN(Number(pruneAge)) 
                    ? defaultAge
                    : Number(pruneAge)
                : pruneAge

            const result = findRemoveSync(process.cwd() + '/resized', {
                age: {
                    seconds: age
                },
                files: '*.*'
            })

            this.logger.log(`Removed ${Object.keys(result).length} files`)
        } catch (error) {
            this.logger.log(String(error))
        }
    }
}

import Fastify from 'fastify'
const _importDynamic = new Function("modulePath", "return import(modulePath)")
import fastify, {FastifyLoggerOptions, RawServerBase} from 'fastify'
import {PinoLoggerOptions} from 'fastify/types/logger'
import {DateTime,} from 'luxon'
import cors from '@fastify/cors'

export type FastifyHTTPErrorsEnhanced = typeof import("fastify-http-errors-enhanced"); // This is the import type!

export const  loadFastifyHttpError = async (): Promise<FastifyHTTPErrorsEnhanced> => {
    return await _importDynamic("fastify-http-errors-enhanced")
}
import { createPinoBrowserSend, createWriteStream } from "pino-logflare"
import { backendLogger } from './backend-logger'

// create pino-logflare browser stream

const startServer = async () => {
    const logger:  FastifyLoggerOptions<RawServerBase> & PinoLoggerOptions = {
        ...backendLogger,
        transport: {},
    genReqId: (req) =>
        req.url+ '@'+DateTime.now().toFormat('HH mm ss'),

    serializers: {
        req: request => {
            return {
                path: request.routerPath,
                body: request.body,
            };
        }
    }
    }

    let fastify = Fastify({   logger,
        ignoreTrailingSlash: true,
        bodyLimit: 1048576 * 4,

        trustProxy: true,
        // ?modifyCoreObjects:false"
    });
    const FastifyHTTPErrorsEnhanced = await loadFastifyHttpError()

    fastify.register(FastifyHTTPErrorsEnhanced.default, {
        hideUnhandledErrors: false
    })

    fastify.register(cors,{origin: false, allowedHeaders: '*'})
    fastify.route({
        method: 'POST',
        url: '/log',
        handler: async (request, reply) => {
            
        }
    })
    return fastify
}
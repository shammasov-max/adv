import { createWriteStream } from "pino-logflare"

const stream = createWriteStream({
    apiKey: 'toN3dpwsIAwB',
    sourceToken: 'a0dea23a-695b-40eb-8675-8d718ab79240'//"a0dea23a-695b-40eb-8675-8d718ab79240",
  })
  
export const backendLogger = require('pino-http')({},stream)
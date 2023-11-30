/*import pino from "pino"
import httpTransmit from 'pino-transmit-http'

const defaultOptions = {
  throttle: 500,
  debounce: null as any,
  url: '/log',
  useSendBeacon: true,
  method: 'POST',
  fetch: null as any
}

// create pino loggger
export const logger = pino.default(
  {
    browser: {
      transmit: {
        send: httpTransmit({url: 'https://dev.rengindesk.ru/log'} as typeof defaultOptions),
      },
    },
  }
)*/
import { sleep } from './utils';


export const logger = {...console, err: async (...args: any[]) => {
  console.error(...args)
  await sleep()
}, 
  log: async (...args: any[]) => {
  console.log(...args)
  await sleep()
}}
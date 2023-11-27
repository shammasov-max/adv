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
import consolere from 'console-remote-client'             
import { sleep } from './utils';

const _logger = consolere.connect({
  server: 'https://console.re', // optional, default: https://console.re
  channel: 'shammasov', // required
  redirectDefaultConsoleToRemote: true, // optional, default: false
  disableDefaultConsoleOutput: true, // optional, default: false
});
export const logger = {...console, err: async (...args: any[]) => {
  console.re.error(...args)
  await sleep()
}, 
  log: async (...args: any[]) => {
  console.re.log(...args)
  await sleep()
}}
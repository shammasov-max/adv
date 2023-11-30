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
import * as P from 'pino';
import { sleep } from './utils';

let i = 0;
const addToScreenLog = (text: string, isError = false) => {
  i++
  const line = document.createElement("p");
line.className = isError ? 'error-log' : 'debug-log'
const node = document.createTextNode(`${i}: ${text}`);
line.appendChild(node);

const element = document.getElementById("log");
element.prepend(line);
}

const nextClick = () => 
new Promise( res =>  {
  const nextElement = document.getElementById('next')
  const handler = () =>  {
    nextElement.removeEventListener('click', handler)
    res(true)
  }
  nextElement.addEventListener('click', handler)
}
  )

export const logger = {...console, 
  err: async (...args: any[]) => {
    addToScreenLog(JSON.stringify(args), true)
  console.error(...args)
  await Promise.any([sleep(), nextClick()])
}, 
  log: async (...args: any[]) => {
  console.log(...args)
  addToScreenLog(JSON.stringify(args))
  await Promise.any([sleep(), nextClick()])
}}
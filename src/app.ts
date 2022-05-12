
import WebSocket from 'ws'

import { port } from './utils/consts'

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// start the server and specify the port number
const wss = new WebSocket.Server({ port: port })

let ip;

async function ls() {
    // this command will read the ip address of the machine
    // so the client app can easily connect.

    const ipCommand = "ipconfig getifaddr en0"
    const { stdout, stderr } = await exec(ipCommand);
    let ip = stdout.replace(/\n/g, '');

    console.log(`IP is ${ip}`);
    console.log(`[WebSocket] Starting WebSocket server on ${ip}:${port}`)
}
ls();


wss.on("connection", (ws: any, request: any): void => {

    const url = request.url

    ws.on("message", (messageAscii: any) => {
    })
})

wss.on("error", (error: any) => {
    console.log(`[WebSocket] Error: ${error}`)
});

wss.on("close", (code: any, reason: any) => {
    console.log(`[WebSocket] Closed: ${code} ${reason}`)
});

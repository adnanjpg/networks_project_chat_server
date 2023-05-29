import * as WebSocket from "ws"
import MessageHandler from "./processors/message_handler"

import { port } from "./utils/consts"

import * as util from "util"
import * as child from "child_process"
const exec = util.promisify(child.exec)

// start the server and specify the port number
const wss = new WebSocket.Server({ port: port })

async function ls() {
  // this command will read the ip address of the machine
  // so the client app can easily connect.
  // i want to check the os and run the appropriate command,
  // on macos: ipconfig getifaddr en0
  // on linux: hostname -I | awk '{print $1}'

  const os = require("os")
  let ipCommand = ""

  const ismac = os.platform() === "darwin"
  const islinx = os.platform() === "linux"

  console.log(`[WebSocket] OS is ${os.platform()}`)

  if (ismac) {
    ipCommand = "ipconfig getifaddr en0"
  } else if (islinx) {
    ipCommand =
      "ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d '/' -f 1"
  } else {
    throw new Error("Unsupported OS")
  }

  const { stdout } = await exec(ipCommand)
  let ip = stdout.replace(/\n/g, "")

  console.log(`[WebSocket] IP is ${ip}`)
  console.log(`[WebSocket] Starting WebSocket server on ${ip}:${port}`)
}
ls()

wss.on("connection", (ws: WebSocket, request: any): void => {
  let id = MessageHandler.addClient(ws)

  ws.on("message", (messageAscii: any) => {
    MessageHandler.handleMessage(id, messageAscii)
  })

  ws.on("close", () => {
    MessageHandler.removeClient(id)
  })
})

wss.on("error", (error: any) => {
  console.log(`[WebSocket] Error: ${error}`)
})

wss.on("close", (code: any, reason: any) => {
  console.log(`[WebSocket] Closed: ${code} ${reason}`)
})

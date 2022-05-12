
class MessageHandler {
    ws: any

    constructor(ws: any) {
        this.ws = ws
    }

    strEquals(str1: String, str2: String): boolean {
        return str1 && str2 && str1.toLowerCase() == str2.toLowerCase()
    }

    handleMessage(messageAscii: any): void {
    }
}

export default MessageHandler
import { assert } from "console"
import { dbManager } from "../app"
import MessageModel from "../models/message_model"
import UserModel from "../models/user_model"
import { authCommand } from "../utils/consts"
import StatusCode from "../utils/enums/status_code"

class MessageHandler {
    ws: any

    constructor(ws: any) {
        this.ws = ws
    }

    strEquals(str1: String, str2: String): boolean {
        return str1 && str2 && str1.toLowerCase() == str2.toLowerCase()
    }


    handleMessage(messageAscii: any): void {
        let msg = messageAscii.toString()
        let message = MessageModel.fromJson(msg)

        let commandName = message.title

        console.log(commandName)

        if (!commandName) {
            return;
        }

        if (this.strEquals(commandName, authCommand)) {
            let user = message.user

            let userId = user?.id
            /// if user has entered before,
            /// we generate a new user id
            /// for them 
            if (!user || !userId) {
                userId = dbManager.generateUserId()
                user = new UserModel(userId, user?.name)
            }

            dbManager.addUser(user)

            let response = new MessageModel(user, authCommand, user.toJson(), StatusCode.success)

            this.ws.send(response.toJsonStr())

            console.log('authed user:', user)

            return;
        }
    }
}


export default MessageHandler
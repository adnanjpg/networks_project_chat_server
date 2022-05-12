import { assert } from "console"
import { dbManager } from "../app"
import UserModel from "../models/user_model"
import { authCommand } from "../utils/consts"

class MessageHandler {
    ws: any

    constructor(ws: any) {
        this.ws = ws
    }

    strEquals(str1: String, str2: String): boolean {
        return str1 && str2 && str1.toLowerCase() == str2.toLowerCase()
    }


    handleMessage(messageAscii: any): void {
        let message = messageAscii.toString()

        let sp = message.split("/")

        let commandName = sp[0]


        if (this.strEquals(commandName, authCommand)) {
            let userId = sp[1]

            /// if user has entered before,
            /// we generate a new user id
            /// for them 
            if (!userId) {
                userId = dbManager.generateUserId()
            }

            let user = dbManager.getUser(userId)

            if (!user) {
                let name = sp[2]

                if (!name) {
                    assert(false, "No name provided")
                    return;
                }

                user = new UserModel(userId, name)

                dbManager.addUser(user)

                this.ws.send(`${authCommand}/${userId}/${name}`)

                return;

            }
        }


    }
}

export default MessageHandler
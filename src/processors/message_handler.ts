import { assert } from "console"
import { dbManager } from "../app"
import ChatModel from "../models/chat/chat_model"
import MessageModel from "../models/message_model"
import UserModel from "../models/user_model"
import { authCommand, chatsListCommand, chatsUsersListCommand, createChatCommand, getChatsCommand } from "../utils/commands_consts"
import StatusCode from "../utils/enums/status_code"

class MessageHandler {
    ws: any

    constructor(ws: any) {
        this.ws = ws
    }

    strEquals(str1: String, str2: String): boolean {
        return str1 && str2 && str1.toLowerCase() == str2.toLowerCase()
    }


    sendMsg(msg: MessageModel): void {
        this.ws.send(msg.toJsonStr())
    }

    sendCreateChat(user: UserModel, chat: ChatModel) {
        let msg = new MessageModel(user, createChatCommand, chat.toJson())

        this.sendMsg(msg)
    }

    sendChats(user: UserModel): void {
        let chats = dbManager.getChats()

        chats.forEach(chat => {
            let msg = new MessageModel(user!, chatsListCommand, chat.toJson())
            this.sendMsg(msg)
        })
    }

    handleMessage(messageAscii: any): void {
        let msg = messageAscii.toString()
        let message = MessageModel.fromJson(msg)

        let commandName = message.title

        console.log(commandName)

        if (!commandName) {
            return;
        }

        let user: UserModel | undefined = message.user
        let userId = user?.id

        /// if user has entered before,
        /// we generate a new user id
        /// for them 
        if (!user || !userId) {
            userId = dbManager.generateUserId()
            user = new UserModel(userId, user?.name)
        }

        let u: UserModel = new UserModel(user.id!, user.name)

        dbManager.addUser(u)

        let successResponse = new MessageModel(u, commandName, u.toJson(), StatusCode.success)

        if (this.strEquals(commandName, authCommand)) {
            this.sendMsg(successResponse)

            console.log('authed user:', u)

            return
        }

        if (this.strEquals(commandName, createChatCommand)) {
            let chat = ChatModel.fromJson(message.params)

            if (!chat) {
                assert(false)
            }

            dbManager.addChat(chat)

            this.sendCreateChat(u, chat)
        }

        if (this.strEquals(commandName, getChatsCommand)) {
            this.sendMsg(successResponse)

            this.sendChats(u)

            return
        }

        if (this.strEquals(commandName, chatsUsersListCommand)) {
            let users = dbManager.getUsers()

            users.forEach(user => {
                if (user.id === u.id) {
                    return
                }
                let msg = new MessageModel(user!, chatsUsersListCommand, user.toJson())
                this.sendMsg(msg)
            })

            return
        }
    }
}

export default MessageHandler
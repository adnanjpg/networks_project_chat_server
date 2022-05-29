import { assert } from "console"
import * as WebSocket from "ws"
import ChatMessageModel from "../models/chat/chat_message_model"
import MessageModel from "../models/message_model"
import UserModel from "../models/user_model"
import {
    authCommand,
    chatsUsersListCommand,
    renameChatCommand,
    sendMessageCommand
} from "../utils/commands_consts"

abstract class MessageHandler {

    static connectedClients = new Map<string, WebSocket>()
    static connectedUsers: UserModel[] = new Array<UserModel>()

    private static id = 0
    static generateId(): string {
        return (this.id++).toString()
    }

    static addClient(ws: WebSocket): string {
        let id = this.generateId()
        return this.addClientWithId(id, ws)
    }

    static removeClient(id: string): void {
        this.connectedClients.delete(id)
        this.connectedUsers = this.connectedUsers.filter(u => u.id != id)

        MessageHandler.streamUsersToAll()
    }

    static addClientWithId(id: string, ws: WebSocket): string {
        this.connectedClients.set(id, ws)

        MessageHandler.streamUsersTo(id)

        return id
    }

    static addUser(ip: string, name: string) {

        let u = new UserModel(ip, name)

        this.connectedUsers.push(u)
    }

    static sendChatMessage(chatMsg: ChatMessageModel): void {
        let recievers = chatMsg.recieversIds

        recievers.forEach((recieverId: string) => {

            let ws = this.connectedClients.get(recieverId)

            assert(ws !== undefined, "ws is undefined")
            if (ws) {

                let msg = new MessageModel(sendMessageCommand, chatMsg.toJson())

                this.sendMsgToWs(msg, ws)
            }

        })
    }
    static sendChangeNameMsg(title: string, recievers: string[]): void {

        recievers.forEach((recieverId: string) => {

            let ws = this.connectedClients.get(recieverId)

            assert(ws !== undefined, "ws is undefined")
            if (ws) {

                let msg = new MessageModel(renameChatCommand, { 'title': title, 'recievers': recievers })

                this.sendMsgToWs(msg, ws)
            }

        })
    }

    static getUsersFilter(): UserModel[] {
        let ids = new Set<string>(this.connectedUsers.filter(u => u.id).map(u => u.id!))

        let usrs = new Array<UserModel>()

        ids.forEach(id => {
            let u = this.connectedUsers.find(u => u.id === id)

            if (u) {
                usrs.push(u)
            }
        })

        return usrs
    }

    static streamUsersTo(id: string): void {
        let ws = this.connectedClients.get(id)

        if (!ws) {
            return
        }


        let users = this.getUsersFilter().filter(u => u.id != id)
        let usersJson = users.map(u => u.toJson())
        let msg = new MessageModel(chatsUsersListCommand, { 'users': usersJson })

        this.sendMsgToWs(msg, ws)
    }

    static streamUsersToAll(id?: string): void {
        return this.streamUsersToAllExcept()
    }

    static streamUsersToAllExcept(id?: string): void {
        let keys = Array.from(this.connectedClients.keys())

        for (let idd in keys) {
            if (idd != id) {
                this.streamUsersTo(idd)
            }
        }
    }

    static strEquals(str1: String, str2: String): boolean {
        return str1 && str2 && str1.toLowerCase() == str2.toLowerCase()
    }


    static sendMsgToWs(msg: MessageModel, ws: WebSocket): void {
        ws.send(msg.toJsonStr())
    }

    static authUser(user: UserModel): void {
        if (!user.id) {
            return
        }


        let ws = this.connectedClients.get(user.id)

        if (!ws) {
            return
        }

        let msg = new MessageModel(authCommand, user?.toJson())

        this.sendMsgToWs(msg, ws)
    }

    static handleMessage(ip: string, messageAscii: any): void {
        let msg = messageAscii.toString()
        let message = MessageModel.fromJson(msg)

        let commandName = message.title

        console.log(commandName)

        if (!commandName) {
            return
        }

        if (this.strEquals(commandName, authCommand)) {
            let prms = message.params

            if (!prms) {
                return
            }

            let name = prms["name"]

            this.addUser(ip, name)

            this.streamUsersToAllExcept(ip)

            this.authUser(new UserModel(ip, name))

            return
        }

        if (this.strEquals(commandName, sendMessageCommand)) {
            let prms = message.params
            prms.senderId = ip

            let chatMsg = ChatMessageModel.fromJson(message.params)

            if (!chatMsg) {
                assert(false)
            }

            this.sendChatMessage(chatMsg)
            return
        }

        if (this.strEquals(commandName, renameChatCommand)) {
            let prms = message.params

            let title = prms["title"]
            let recievers = prms["recievers"]

            this.sendChangeNameMsg(title, recievers)
            return
        }

    }
}

export default MessageHandler
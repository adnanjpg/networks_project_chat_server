import { TypedJsonDB } from "ts-json-db/dist/src";
import AttachmentModel from "../models/chat/attachment_model";
import ChatMessageModel from "../models/chat/chat_message_model";
import ChatModel from "../models/chat/chat_model";
import ContentDef from "../models/contect_def";
import UserModel from "../models/user_model";

class DbManager {
    db: TypedJsonDB<ContentDef>

    constructor() {
        this.db = new TypedJsonDB<ContentDef>("config.json")
    }

    getUsers(ids?: string[]): UserModel[] {
        let usrs = this.db.get("/users")?.map(UserModel.fromJson)

        if (usrs) {

            if (ids) {
                return usrs.filter(user => user && user.id && ids.includes(user.id))
            }

            return usrs
        }

        return []
    }

    getUser(id: string): UserModel | undefined {
        return this.getUsers()?.find(user => user.id === id)
    }

    generateUserId(): string {
        return this.getUsers().length.toString()
    }

    addUser(user: UserModel): void {
        this.db.push("/users", user.toJson())
    }

    getChats(ids?: string[]): ChatModel[] {
        let chats = this.db.get("/chats")?.map(ChatModel.fromJson)

        if (chats) {

            if (ids) {
                return chats.filter(chat => chat && chat.id && ids.includes(chat.id))
            }

            return chats
        }

        return []
    }

    getChat(id: string): ChatModel | undefined {
        return this.getChats()?.find(chat => chat.id === id)
    }

    addChat(chat: ChatModel): void {
        this.db.push("/chats", chat.toJson())
    }

    generateChatId(): string {
        return this.getChats().length.toString()
    }

    getMessages(ids?: string[]): ChatMessageModel[] {
        let msgs = this.db.get("/messages")?.map(ChatMessageModel.fromJson)

        if (msgs) {

            if (ids) {
                return msgs.filter(msg => msg && msg.id && ids.includes(msg.id))
            }
        }

        return []
    }

    getMessage(id: string): ChatMessageModel | undefined {
        return this.getMessages()?.find(msg => msg.id === id)
    }

    addMessage(message: ChatMessageModel): void {
        this.db.push("/messages", message.toJson())
    }

    generateMessageId(): string {
        return this.getMessages().length.toString()
    }

    getAttachments(ids?: string[]): AttachmentModel[] {
        let atts = this.db.get("/attachments")?.map(AttachmentModel.fromJson)

        if (atts) {

            if (ids) {
                return atts.filter(att => att && att.id && ids.includes(att.id))
            }
        }

        return []
    }

    getAttachment(id: string): AttachmentModel | undefined {
        return this.getAttachments()?.find(att => att.id === id)
    }

    addAttachment(attachment: AttachmentModel): void {
        this.db.push("/attachments", attachment.toJson())
    }

    generateAttachmentId(): string {
        return this.getAttachments().length.toString()
    }

}

export default DbManager
import assert from "node:assert"
import { dbManager } from "../../app"
import AttachmentModel from "./attachment_model"

class ChatMessageModel {
    id: string
    chatId: string

    message?: string

    attachments: AttachmentModel[]

    constructor(id: string, chatId: string, message?: string, attachmentIds?: string[]) {
        this.id = id
        this.chatId = chatId
        this.message = message
        this.attachments = dbManager.getAttachments(attachmentIds)

        assert(message || (attachmentIds && attachmentIds.length != 0),
            "message or attachments must be defined")
    }

    static fromJson(json: any): ChatMessageModel {
        /// json.attachments is lists of ids
        return new ChatMessageModel(json.id, json.chatId, json.message, json.attachments)
    }

    toJson(): any {
        return {
            id: this.id,
            chatId: this.chatId,
            message: this.message,
            attachments: this.attachments.map((attachment: AttachmentModel) => attachment.id)
        }
    }
}

export default ChatMessageModel
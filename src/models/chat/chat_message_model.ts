import assert from "node:assert"
import AttachmentModel from "./attachment_model"

class ChatMessageModel {
    id: string
    recieversIds: string[]
    senderId: string

    message?: string

    attachments: AttachmentModel[]

    constructor(
        id: string,
        recieversIds: string[],
        senderId: string,
        message?: string,
        attachments?: AttachmentModel[],
    ) {
        this.id = id
        this.recieversIds = recieversIds
        this.senderId = senderId
        this.message = message
        this.attachments = attachments || []

        assert(message || (attachments && attachments.length != 0),
            "message or attachments must be defined")
    }

    static fromJson(json: any): ChatMessageModel {
        /// json.attachments is lists of ids
        return new ChatMessageModel(
            json.id,
            json.recieversIds,
            json.senderId,
            json.message,
            json.attachments?.map((attachment: any) => AttachmentModel.fromJson(attachment)) || []
        )
    }

    toJson(): any {
        return {
            id: this.id,
            recieversIds: this.recieversIds,
            senderId: this.senderId,
            message: this.message,
            attachments: this.attachments.map((attachment: AttachmentModel) => attachment.toJson)
        }
    }
}

export default ChatMessageModel
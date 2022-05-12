import { ContentBase } from "ts-json-db/dist/src"
import AttachmentModel from "./chat/attachment_model"
import ChatMessageModel from "./chat/chat_message_model"
import ChatModel from "./chat/chat_model"
import UserModel from "./user_model"

interface ContentDef extends ContentBase {
    paths: {
        '/users': {
            entryType: "array",
            valueType: UserModel
        },
        '/chats': {
            entryType: "array",
            valueType: ChatModel
        },
        '/messages': {
            entryType: "array",
            valueType: ChatMessageModel
        },
        '/attachments': {
            entryType: "array",
            valueType: AttachmentModel
        }
    }
}

export default ContentDef

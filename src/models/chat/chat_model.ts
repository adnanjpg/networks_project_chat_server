import { dbManager } from "../../app"
import DbManager from "../../processors/db_manager"
import UserModel from "../user_model"

class ChatModel {
    id: string
    users: UserModel[]
    title?: string

    constructor(id: string, users: UserModel[], title?: string) {
        this.id = id
        this.users = users
        this.title = title
    }

    static fromJson(json: any): ChatModel {
        let users = (json.users as string[]).map((user: string) => UserModel.fromJson(user))
        /// json.users is a list of ids
        return new ChatModel(json.id || (new DbManager()).generateChatId(), users, json.title)
    }

    toJson(): any {
        return {
            id: this.id,
            users: this.users.map((user: UserModel) => user.toJson()),
            title: this.title
        }
    }
}

export default ChatModel
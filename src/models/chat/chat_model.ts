import { dbManager } from "../../app"
import UserModel from "../user_model"

class ChatModel {
    id: string
    users: UserModel[]
    title?: string

    constructor(id: string, userIds: string[], title?: string) {
        this.id = id
        this.users = dbManager.getUsers(userIds)
        this.title = title
    }

    static fromJson(json: any): ChatModel {
        /// json.users is a list of ids
        return new ChatModel(json.id, json.users, json.title)
    }

    toJson(): any {
        return {
            id: this.id,
            users: this.users.map((user: UserModel) => user.id),
            title: this.title
        }
    }
}

export default ChatModel
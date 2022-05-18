import { dbManager } from "../app"
import StatusCode from "../utils/enums/status_code"
import UserModel from "./user_model"

class MessageModel {
    /// null in cases of log in
    /// requests
    user?: UserModel


    title?: string
    params?: Object
    status?: StatusCode

    constructor(user: UserModel, title: string, params: Object, status: StatusCode) {
        this.user = user
        this.title = title
        this.params = params
        this.status = status
    }

    static fromJson(json: any): MessageModel {
        let map = JSON.parse(json)
        const user = map["user"]
        const title = map["title"]
        const params = map["params"]
        const status = map["status"]
        return new MessageModel(user, title, params, status)
    }

    toJson(): any {
        return {
            "userId": this.user?.toJson(),
            "title": this.title,
            "params": this.params,
            "status": this.status,
        }
    }

    toJsonStr(): string {
        return JSON.stringify(this.toJson())
    }
}

export default MessageModel
import { dbManager } from "../app"
import UserModel from "./user_model"

class MessageModel {
    /// null in cases of log in
    /// requests
    user?: UserModel

    constructor(userId: string) {
        this.user = dbManager.getUser(userId)
    }
}

export default MessageModel
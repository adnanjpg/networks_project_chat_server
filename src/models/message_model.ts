import StatusCode from "../utils/enums/status_code"

class MessageModel {
    title?: string
    params?: any
    status?: StatusCode

    constructor(title: string, params?: any, status?: StatusCode) {
        this.title = title
        this.params = params
        this.status = status
    }

    static fromJson(json: any): MessageModel {
        let map = JSON.parse(json)
        const title = map["title"]
        const params = map["params"]
        const status = map["status"]
        return new MessageModel(title, params, status)
    }

    toJson(): any {
        return {
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
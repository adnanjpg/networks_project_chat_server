import { assert } from "console"

class AttachmentModel {
    id: string
    url?: string
    path?: string

    constructor(id: string, url?: string, path?: string) {
        this.id = id
        this.url = url
        this.path = path

        assert(url || path, "url or path must be defined")
    }

    static fromJson(json: any): AttachmentModel {
        /// json.users is a list of ids
        return new AttachmentModel(json.id, json.url, json.path)
    }

    toJson(): any {
        return {
            id: this.id,
            url: this.url,
            path: this.path
        }
    }
}

export default AttachmentModel
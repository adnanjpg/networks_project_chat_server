
class UserModel {
    id?: string
    name?: string

    constructor(id: string, name?: string) {
        this.id = id
        this.name = name
    }

    static fromJson(json: any): UserModel {
        return new UserModel(json.id, json.name)
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name
        }
    }

}

export default UserModel
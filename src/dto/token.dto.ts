export class TokenDto {
    readonly email: string;
    readonly id: number;
    readonly role: [];
    readonly isActivated: boolean

    constructor(model) {
        this.id = model.id;
        this.role = model.roles;
        this.email = model.email;
        this.isActivated = model.isActivated;
    }
}
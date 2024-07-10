import { atom } from "recoil";

export type User = {
    user ?: {
        email ?: string | null,
        image ?: string | null,
        name ?: string | null
    },
    expires ?: string | null
}

export type Client = {
    name : string,
    email ?: string,
    id : string,
}

const UserData = atom<User>({
    key : "userSessionData",
    default : {} as User,
});

const ClientData = atom<Client>({
    key : "clientSessionData",
    default : {} as Client
})
export { UserData,ClientData };



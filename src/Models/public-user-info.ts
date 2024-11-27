import { Friendship } from "./friendship"

export interface PublicUserInfo {
    userid: string,
    displayname: string,
    bio: string,
    profilepicurl: string,
    follows: Friendship[],
    followers: Friendship[],
}
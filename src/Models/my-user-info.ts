import { Friendship } from "./friendship";
import { Gender } from "./gender";
import { Point } from "./point";

export class MyUserInfo {
    userid: string;
    displayname: string;
    email: string;
    firstname: string;
    lastname: string;
    middlename: string;
    bio: string;
    profilepicurl: string;
    datofbirth: Date;
    gender: number;
    genderinfo: Gender;
    phonenumber: string;
    streetaddress: string;
    usercity: string;
    stateorprovince: string;
    postalcode: string;
    country: string;
    ispublic: boolean;
    longitude_latitude: Point;
    follows: Friendship[];
    followers: Friendship[];
    constructor (
        userid: string,
        displayname: string,
        email: string,
        firstname: string,
        lastname: string,
        middlename: string,
        bio: string,
        profilepicurl: string,
        datofbirth: Date,
        gender: number,
        genderinfo: Gender,
        phonenumber: string,
        streetaddress: string,
        usercity: string,
        stateorprovince: string,
        postalcode: string,
        country: string,
        ispublic: boolean,
        longitude_latitude: Point,
        follows: Friendship[],
        followers: Friendship[],
    ){
        this.userid = userid;
        this.displayname = displayname;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.middlename = middlename;
        this.bio = bio;
        this.profilepicurl = profilepicurl;
        this.datofbirth = datofbirth;
        this.gender = gender;
        this.genderinfo = genderinfo;
        this.phonenumber = phonenumber;
        this.streetaddress = streetaddress;
        this.usercity = usercity;
        this.stateorprovince = stateorprovince;
        this.postalcode = postalcode;
        this.country = country;
        this.ispublic = ispublic;
        this.longitude_latitude = longitude_latitude;
        this.follows = follows;
        this.followers = followers;
    }

}
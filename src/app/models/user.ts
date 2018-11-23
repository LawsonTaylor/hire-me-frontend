export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
}

export interface IGraduate extends IUser {
    university: string;
    degree: string;
    major: string;
    gpa: number;
    employers: Array<string>;
    locations: Array<string>;
}


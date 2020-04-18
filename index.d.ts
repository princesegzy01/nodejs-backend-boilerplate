import { interfaceExtends } from "@babel/types";

declare module '*';

export interface TemplateForgorPassword {
	subject: string;
	text: string;
	html: string
}

export interface Template {
	subject: string;
	text: string;
	html: string
}

export interface JwtTokenInput {
	id: number;
	role: string;
}

export interface Headers {
	authorization: string;
}


export interface ValidationObjs {
	headers: any;
	params: any;
	query: any;
	body: any;
}


export interface ErrorHandler {
	name: string,
	message: string,
	deleted: boolean,
	statusCode: number,
	errorCode: number
}


export interface User {
	first_name: string,
	last_name: string,
	email: string,
	password: string,
	verification_code: string,
	password_reset_token: string,
	role: number

}

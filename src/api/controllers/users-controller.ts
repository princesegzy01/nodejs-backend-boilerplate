import User from '../models/User'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import {
	Unauthorized,
	encryptPassword,
	generateJWTToken,
	sendEmail,
	NotFound,
	Conflict,
	InternalServerError
} from '../helpers'
import { templateForgetPassword } from '../utils/reset-password-template'
import { reject } from 'bluebird';

import userState from '../utils/user-state';

/**
 * Login with username and password from context body
 * @param ctx This is the request context
 * return the record of the loggedin user if successful
 * return the specific error if operation failed
 */
export const login = async (ctx: any) => {
	const { body } = ctx.request

	/**
	 * Check if the user supplied a valid email address
	 */
	const user = await new User({ email: body.email }).fetch().catch(() => {
		throw NotFound('User not found')
	})

	/**
	 * Check if the user account is not blocked or not verified
	 * if account state ==3, then account is not verified
	 */
	if (user.attributes.account_state == 3) {
		throw Unauthorized('Unauthorized, Account is not verified')
	}

	/**
	 * Check if user supplied the right password
	 * perform password check by passing it through a bcrypt function
	 */
	const isValid = await bcrypt.compare(body.password, user.attributes.password)
	if (!isValid) {
		throw Unauthorized('Unauthorized, password is invalid')
	}

	/**
	 * If successful, convert user record to json
	 */
	const parsedUser = user.toJSON()

	/**
	 *  Generate the json web token for this user
	 */
	return {
		...parsedUser,
		token: generateJWTToken({ id: parsedUser.id, role: parsedUser.role })
	}
}

/**
 * verify the account
 * @param ctx This is the request context
 */
export const verify = async (ctx: any) => {
	const { body } = ctx.request

	/**
	 * Check if the user supplied a valid email address
	 */
	const user = await new User({ email: body.email }).fetch().catch(() => {
		throw NotFound('User with specified email not found')
	})

	/**
	 * Check if taccount has been verified before
	 */
	if (user.attributes.account_state === 2) {
		return { 'status': 'Account previously activated' };
	}

	/**
	 * Check if the user supply a valid verification code
	 */
	if (user.attributes.verification_code !== body.code) {
		throw NotFound('Invalid Verification code supplied')
	}

	/**
	 *  update account and set it to active
	 */
	new User().where({ 'email': body.email }).save({ account_state: 2 }, { method: 'update' }).catch((err: any) => {
		throw InternalServerError("Error activating this account")
	})


	return { 'status': 'Account successfully verified' }
}


export const forget = async (ctx: any) => {
	const { body } = ctx.request
	const token = crypto.randomBytes(10).toString('hex')

	await new User()
		.where({ email: body.email })
		.save(
			{
				password_reset_token: token
			},
			{ method: 'update' }
		)
		.catch((err: any) => {
			// throw new NotFound('User not found')
			reject('User not found')
		})

	const template = templateForgetPassword(token)

	await sendEmail(body.email, template)

	return { email: body.email }
}

export const reset = async (ctx: any) => {
	const { token, password } = ctx.request.body

	const newPassword = await encryptPassword(password)

	return new User()
		.where({ password_reset_token: token })
		.save(
			{
				password: newPassword,
				password_reset_token: null
			},
			{ method: 'update' }
		)
		.catch((err: any) => {
			// throw new NotFound('User not found')
			reject('User not found')
		})
}

export const index = () => new User().fetchAll()

export const show = (ctx: any) => new User({ id: ctx.params.id }).fetch()

/**
 * Create an account with this endpoint
 * @param ctx This is the request context
 * return the record of the created user if successful
 * return the specific error if operation failed
 */
export const create = async (ctx: any) => {
	const { body } = ctx.request


	const first_name = body.first_name.trim()
	const last_name = body.last_name.trim()
	const email = body.email.trim()
	const password = body.password.trim()
	const role: number = body.role

	/**
	 * Check if user is not exist
	 * and return error
	*/
	const userQuery = await new User().where('email', email).fetchAll();
	const userQueryLength = userQuery.toJSON().length;

	/**
	 * count the number of user returned
	 * if users is greater than 0, throw error
	 */

	console.log(userQuery.toJSON())
	if (userQueryLength == 1) {
		throw Conflict('Account with same email already exist')
	}

	/**
	 * Generate verification code
	 */
	const randomNumbers = String(Math.floor((Math.random() * 9999) + 999));
	const verification_code = randomNumbers.substring(0, 4)

	/**
	 * If user with same email does not exist,
	 *  create and return the user
	 */
	const newUser = await new User({
		first_name: first_name,
		last_name: last_name,
		email: email,
		verification_code: verification_code,
		password: await encryptPassword(password),
		role: role,
		account_state: userState.NOTVERIFIED
	}).save()

	/**
	 * check if there is an error while creating the account
	 * and return it
	 */
	if (!newUser) {
		throw InternalServerError("An error occurred while setting up this account");
	}

	//send email afterwards

	// return created user
	return newUser
}

export const update = async (ctx: any) => {
	const { body } = ctx.request

	return new User({ id: ctx.params.id }).save(
		{
			name: body.name,
			email: body.email,
			password: await encryptPassword(body.password),
			role: body.role
		},
		{ method: 'update' }
	)
}

export const destroy = (ctx: any) => new User({ id: ctx.params.id }).destroy()

export default {
	login,
	index,
	show,
	create,
	update,
	destroy,
	forget,
	reset,
	verify
}

export const NotFound = (
	message = 'The requested resource could not be found'
) => ({
	name: 'NotFound',
	message,
	statusCode: 404,
	errorCode: 404
})

export const BadRequest = (message = 'The json data is malformed') => ({
	name: 'BadRequest',
	message,
	statusCode: 400,
	errorCode: 400
})


export const InternalServerError = (message = 'The API did something wrong') => ({
	name: 'InternalServerError',
	message,
	statusCode: 500,
	errorCode: 500
})
export const Unauthorized = (message = 'Incorrect username or password') => ({
	name: 'Unauthorized',
	message,
	statusCode: 401,
	errorCode: 401
})

export const Deleted = (message = 'Successfully deleted') => ({
	name: 'Deleted',
	message,
	deleted: true,
	statusCode: 200,
	errorCode: 200
})

export const Conflict = (message = 'Record previously exist') => ({
	name: 'Duplicate',
	message,
	statusCode: 409,
	errorCode: 409
})

export const errorHandling = (err: any) => {

	if (err.errorCode) {
		return err
	}

	if (err.originalError) {
		return Unauthorized(err.originalError.message)
	}

	switch (err.statusCode || err.status || 500) {
		case 404:
			return NotFound(err.message || err.toString())
		case 400:
			return BadRequest(err.message || err.toString())
		case 500:
			return InternalServerError(err.message || err.toString())
		case 401:
			return Unauthorized(err.message || err.toString())
		case 409:
			return Conflict(err.message || err.toString())
		default:
			return
	}

}

import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
	path: path.resolve(__dirname, '../.env')
})

export const JWT_SECRET = process.env.SECRET || 'mysupersecret'
export const PORT = process.env.PORT || 3000
export const DATABASE = process.env.DATABASE_URL || 'postgres://xx:xx@localhost:5432/DB'
export const NODE_ENV: string = process.env.NODE_ENV || 'development'
// export const BUCKET_TYPE = process.env.BUCKET_TYPE || 'firebase'
export const URL_FRONT = process.env.URL_FRONT || 'localhost'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { JWT_SECRET } from '../config'
import { JwtTokenInput } from '../../..';

export const generateJWTToken = ({ id, role }: JwtTokenInput) =>
  jwt.sign({ id, role }, JWT_SECRET)

export const encryptPassword = (password: string, length = 10) =>
  bcrypt.hash(password, length)

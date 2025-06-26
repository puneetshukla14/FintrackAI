import jwt, { JwtPayload } from 'jsonwebtoken'
const SECRET = process.env.JWT_SECRET || 'supersecret'

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d', algorithm: 'HS256' })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
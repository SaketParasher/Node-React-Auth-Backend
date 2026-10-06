import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt);
const keyLength = 64

export async function hashPassword(password) {

    try {
        const saltBytes = randomBytes(16)
        const hashedPassword = await scryptAsync(password, saltBytes, keyLength)

        return {
            salt: saltBytes.toString('hex'),
            passwordHash: hashedPassword.toString('hex')
        }

    } catch (error) {
        console.log(error)
        throw new Error("Error in hashing password")
    }
}


export async function verifyPassword(password, storedHashHex, storedSaltHex) {
    try {
        const saltBuffer = Buffer.from(storedSaltHex, 'hex')

        // hash the password using the same saltBuffer
        const hashedPassword = await scryptAsync(password, saltBuffer, keyLength)
        const targetHashHex = hashedPassword.toString('hex')

        // compare the new hash with stored hash
        return timingSafeEqual(
            Buffer.from(storedHashHex, 'hex'),
            Buffer.from(targetHashHex, 'hex')
        )
    } catch (error) {
        console.log(error);
        throw new Error("Error while verifying password")
    }

}

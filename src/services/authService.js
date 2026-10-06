
import { randomUUIDv7 } from 'crypto'

import { findUserByEmail, createUser, findUserById } from '../repositories/userRepository.js';
import { hashPassword, verifyPassword } from '../utils/password.js'


// A standard, robust email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalidEmailorPassword = {
    status: 401,
    json: {
        error: true,
        message: "Invalid Email or Password !"
    }
}

export async function signup(name, email, password) {
    try {
        const normalizedName = name.trim()
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedName || !normalizedEmail || !password || !emailRegex.test(normalizedEmail)) {
            return {
                status: 400,
                json: {
                    error: true,
                    message: 'Invalid Input. Name, Valid Email and Password is Required to Signup'
                }
            }
        }


        const existingUser = await findUserByEmail(normalizedEmail)
        if (existingUser) {
            return {
                status: 409,
                json: {
                    error: true,
                    message: 'User with this email already exists!'
                }
            }
        }

        const hashedPassword = await hashPassword(password.trim())
        const newUser = {
            id: randomUUIDv7(),
            name: normalizedName,
            email: normalizedEmail,
            hashedPassword,
            role: 'user',
            createdAt: new Date().toISOString()
        }

        await createUser(newUser)
        delete newUser["hashedPassword"]

        return {
            status: 201,
            json: {
                error: false,
                user: {
                    ...newUser
                }
            }
        }
    } catch (error) {
        console.log(`Error in Auth Service `, error)
        throw new Error('AUTH SERVICE ERROR ')
    }
}

export async function login(email = '', password = '') {
    const normalizedEmail = email.trim().toLowerCase()

    try {
        if (!normalizedEmail || !password) {
            return {
                status: 400,
                json: {
                    error: true,
                    message: 'Please enter email and password to login'
                }
            }
        }
        // find user by email if not found return 401
        const user = await findUserByEmail(normalizedEmail)
        if (!user) {
            return invalidEmailorPassword
        }

        // if user exists verify the password
        const { hashedPassword: {
            salt, passwordHash
        } } = user;

        const isPasswordValid = await verifyPassword(password, passwordHash, salt)
        if (!isPasswordValid) {
            return invalidEmailorPassword
        }

        return {
            status: 200,
            json: {
                error: false,
                message: 'Login Success )',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            }
        }
    } catch (error) {
        console.log('Error while Log in ', error)
        throw new Error('Error in Auth Login Service')
    }

}

export async function getCurrentUser(userId) {
    try {
        const user = await findUserById(userId)
        if (!user) {
            return {
                status: 401,
                json: {
                    error: true,
                    message: "You are not logged-in/authorized"
                }
            }
        }

        return {
            status: 200,
            json: {
                error: false,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            }
        }

    } catch (error) {
        console.log('Error while Log in ', error)
        throw new Error('Error in Auth Get Current User')
    }
}
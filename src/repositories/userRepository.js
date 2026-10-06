import { open } from "fs/promises"
import { join } from 'path'

// FILE PATH OF USERS.JSON
const filePath = join(import.meta.dirname, '../../data/users.json')

export async function findUserByEmail(email) {
    let fileHandle;

    try {
        fileHandle = await open(filePath, 'r')
        const userData = JSON.parse(await fileHandle.readFile({ encoding: 'utf-8' }))
        return userData.find(user => user.email === email)

    } catch (error) {
        console.log("Error While Finding user by Email")
    } finally {
        await fileHandle?.close()
    }

}

export async function findUserById(id) {
    let fileHandle;

    try {
        fileHandle = await open(filePath, 'r')
        const userData = JSON.parse(await fileHandle.readFile({ encoding: 'utf-8' }))
        return userData.find(user => user.id === id)

    } catch (error) {
        console.log("Error While Finding user by Email")
    } finally {
        await fileHandle?.close()
    }

}

export async function createUser(user) {
    let fileHandle;
    try {
        // open the file in r+ mode for both read and write
        fileHandle = await open(filePath, "r+")
        const data = JSON.parse(await fileHandle.readFile({ encoding: 'utf-8' }))

        data.push({ ...user })

        // reset the file pointer to beginning
        await fileHandle.truncate(0)
        await fileHandle.write(JSON.stringify(data, null, 2), 0, 'utf-8')

    } catch (error) {
        console.log(error);
        throw new Error("Error while creating user in createUser utility")
    } finally {
        await fileHandle?.close()
    }
}

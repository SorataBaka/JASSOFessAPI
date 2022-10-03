import { Request, Response } from "express";
import crypto from "crypto";
import users from "../../../../schemas/users";
const alphaNumericCheck = new RegExp("^[a-zA-Z0-9_]{7, 15}*$");
export default async function(req:Request, res:Response){
    const username = req.body["username"];
    const password = req.body["password"];

    if(username === undefined || password == undefined){
        return res.status(400).json({
            status: 400,
            isValid: false,
            data: {
                message: "Invalid Request",
                code: "BADREQUEST"
            }
        })
    }
    const validateUserString = alphaNumericCheck.test(username);
    if(!validateUserString) return res.status(400).json({
        status: 400,
        isValid: false,
        data: {
            message: "Username may not include non-alphanumeric characters",
            code: "ILLEGALCHARA"
        }
    })
    // validate if the username already exists
    const userExistValidate = await users.find({username: username});
    if(userExistValidate.length !== 0) return res.status(400).json({
        status: 400,
        isValid: false,
        data: {
            message: "Duplicate username detected. Please choose a new username",
            code: "DUPLICATEUSER"
        }
    })
    const newuser = new users({
        username: username,
        passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
        createdAt: new Date(),
        deletedAt: undefined
    })

    const userSave = await newuser.save().catch(_err => {return undefined})
    if(userSave === undefined) return res.status(500).json({
        status: 500,
        isValid: false,
        data: {
            message: "Something went wrong in the database",
            code: "INTERNALSERVERERROR"
        }
    })
    return res.status(200).json({
        status: 200,
        isValid: true,
        data: {
            message: "OK",
            code: "OK",
            user: {
                id: userSave._id,
                username: userSave.username
            }

        }
    })
}


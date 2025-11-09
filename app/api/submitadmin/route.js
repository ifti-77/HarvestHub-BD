

import ConnectToDB from "@/lib/mongoDB"
import Admin from "@/app/models/Admin"

export async function POST(req, res) {
    try {
        await ConnectToDB()
        const { userid, password } = await req.json()
        const newAdmn = await Admin.create({ userid: userid, password: password })
    } 
    catch (error) {
        return new Response("ERROR: Could not procced ", { status: 500 })
    }
    return new Response("Admin Created Succesfully", {status: 200})
}   

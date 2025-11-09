import ConnectToDB from "@/lib/mongoDB";
import Comodities from "@/app/models/Comodities";

export async function GET(req) {
    try{
        const {searchParams} = new URL(req.url)
        const uniqueID = searchParams.get('uniqueId')
        await ConnectToDB()
        const commodity = await Comodities.findOne({uniqueID: uniqueID})
        if(commodity)
        {
            return new Response(JSON.stringify(commodity),{status:200, headers:{'content-type':'application/json'}})
        }

        return new Response("No Commodity Found",{status:401})
    }
    catch(error)
    {
        return new Response(error,{status:500})
    }
}
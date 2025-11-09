import Comodities from "@/app/models/Comodities";
import ConnectToDB from "@/lib/mongoDB";


export async function GET(){
    try{

        await ConnectToDB();
        const selectedEntry = await Comodities.find()
        if(selectedEntry)
        {
            
            return new Response(JSON.stringify(selectedEntry),{status:200,
                headers:{'content-type': 'application/json'}
            })
        }
        
        return new Response("Somthing went wrong while fetching Commodities",{status:400})
    }catch(error)
    {
        return new Response("ERROR: Could not procced",{status:500})
    }
}

export async function POST(req){
    try{
        const {name, division, price,updatedDate} = await req.json()
        await ConnectToDB();
        const lastEntry = await Comodities.findOne().sort({uniqueID:-1})
        
        let new_id = '000001'
        if(lastEntry)
        {
             new_id = (parseInt(lastEntry.uniqueID) + 1).toString().padStart(6,'0')
            
        }
        console.log("UNIQUE ID:", new_id)

        const newEntry = await Comodities.create({
            uniqueID: new_id,
            name:name,
            division:division,
            price:price,
            updatedDate:updatedDate
        })

        if(newEntry){
            return new Response(JSON.stringify(newEntry),{status:200,
              headers :{'content-type':'application/json'}
            })
        }
        return new Response("Somthing went wrong while creating Commodity",{status:400})
    }catch(error)
    {
        return new Response("ERROR: Could not procced",{status:500})
    }
}

export async function PUT(req) {
  try {
    const { uniqueID, name, division, price, updatedDate } = await req.json();
    await ConnectToDB();

    const selectedEntry = await Comodities.findOne({ uniqueID });

    if (!selectedEntry) {
      return new Response("Commodity not found", { status: 404 });
    }

    selectedEntry.name = name?.trim() || selectedEntry.name;
    selectedEntry.division = division?.trim() || selectedEntry.division;

    const lastPrice = selectedEntry.price[selectedEntry.price.length - 1];

    if (!lastPrice || lastPrice.date !== price.date || lastPrice.rate !== price.rate) {
      selectedEntry.price = [...selectedEntry.price, ...price];
    }

    selectedEntry.updatedDate = updatedDate || selectedEntry.updatedDate;
    await selectedEntry.save();

    return new Response("Commodity Updated successfully", { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return new Response("ERROR: Could not proceed", { status: 500 });
  }
}

export async function DELETE(req) {

  try{
    const {uniqueID} = await req.json()
    const deleted = await Comodities.deleteOne({uniqueID: uniqueID})

    if(deleted)
    {
      return new Response('Commodity Deleted successfully',{ status: 200 })
    }
    return new Response("Somthing went wrong while deleting Commodity",{status:400})
  }catch(error)
  {
    return new Response('ERROR: Could not proceed',{ status: 500 })
  }
  
}

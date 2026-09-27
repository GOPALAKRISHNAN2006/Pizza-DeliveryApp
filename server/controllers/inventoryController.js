import Inventory from "../model/Inventory.js"

export const addInventory = async(req,res)=>{
    try{
        const {name,category,quantity,lowStockThreshold} = req.body;
        if(!name || !category || !quantity || !lowStockThreshold){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }
        if(!["base", "cheese", "sauce", "vegetable"].includes(category)){
            return res.status(400).json({
                success:false,
                message:"Category not Available"
            })
         }
         const inventory = await Inventory.create({
            name,category,quantity,lowStockThreshold
         })
        

         return res.status(201).json({
            success:true,
            message:"Inventory Added Successfully"
         })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Error While add inventory"
        })
    }
}

export const getInventory = async(req,res)=>{
    try{
       const inventory = await Inventory.find();
       if(!inventory){
        return res.status(404).json({
            success:fasle,
            message:"Not Found"
        })
       }
       return res.status(200).json({
        success:true,
        inventory
       })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Error while try to get inventories"
        })
    }
}
export const getInventoryById = async(req,res)=>{
    try{
       const {id} = req.params;
       const inventory = await Inventory.findById(id);
       if(!inventory){
        return res.status(404).json({
            success:false,
            message:"Not Found"
        })
       }
       return res.status(200).json({
        success:true,
        inventory
       })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Error while try to get inventory"
        })
    }
}

export const updateInventory = async(req,res)=>{
    try{
        const {id}=req.params;
        const {name,category,quantity,lowStockThreshold} = req.body;
        const inventory = await Inventory.findById(id);
        if(!inventory){
            return res.status(404).json({
                success:false,
                messgae:"Not Found"
            })
        }
        const updatedInventory = await Inventory.findOneAndUpdate(
        {
            _id:id
        },{
            name,category,quantity,lowStockThreshold
        },{
            new: true
        })

        return res.status(200).json({
            success:true,
            message:"Inventory Updated successfully",
            updatedInventory
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Update"
        })
    }
}
export const patchInventory = async(req,res)=>{
    try{
        const {id}=req.params;
        const inventory = await Inventory.findById(id);
        if(!inventory){
            return res.status(404).json({
                success:false,
                messgae:"Not Found"
            })
        }
        const updatedInventory = await Inventory.findOneAndUpdate(
        {
            _id:id
        },
        req.body,
        {
            new: true
        })

        return res.status(200).json({
            success:true,
            message:"Inventory Updated successfully",
            updatedInventory
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Update"
        })
    }
}

export const deleteInventory=async(req,res)=>{
    try{
      const {id}=req.params;
        const inventory = await Inventory.findById(id);
        if(!inventory){
            return res.status(404).json({
                success:false,
                messgae:"Not Found"
            })
        }
        await Inventory.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"Inventory deleted successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to delete inventory"
        })
    }
}
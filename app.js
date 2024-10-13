const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOveride =require("method-override")



const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust"

main()
.then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOveride("_method"));


async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>{
    res.send("Helloo")
})


//index route
app.get("/listings",async (req,res)=>{
  const allListings= await Listing.find({})

  res.render("listings/index.ejs",{allListings});
  
})
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})


//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})


//create route 
app.post("/listings",async(req,res)=>{
 //   let {title,descripton,...} =req.body
 //this can be avoided by giving key value pair for name attribute in form
    const newListing= new Listing(req.body.listing)
await newListing.save();
res.redirect("/listing");
})


//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})


//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
res.redirect("/listings")
})

// app.get("/testListing",async(req,res)=>{
//    let sampleListing =new Listing({
//     title:"My new Villa",
//     description: "By the Beach",
//     price:2000,
//     location:"Bordusani,Romania",
//     country:"Europe"
//    })

//   await sampleListing.save();
//   console.log("sample was save");
//   res.send("Successful");
// })


app.listen(port,()=>{
    console.log("Server le listening to port ",port);
})


require("dotenv").config();
const express=require("express"), mongoose=require("mongoose"), bcrypt=require("bcryptjs"), jwt=require("jsonwebtoken"), path=require("path");
const app=express(); app.use(express.json()); app.use(express.static(path.join(__dirname,"public")));
const schema=new mongoose.Schema({}, {strict:false,timestamps:true});
const User=mongoose.model("User",new mongoose.Schema({name:{type:String,required:true},email:{type:String,unique:true,required:true},password:{type:String,required:true}}));
const Customer=mongoose.model("Customer",new mongoose.Schema({name:{type:String,required:true},email:String,phone:String,company:String,status:{type:String,default:"Active"},notes:String,owner:String},{timestamps:true}));
const Lead=mongoose.model("Lead",new mongoose.Schema({title:{type:String,required:true},contactName:{type:String,required:true},company:String,email:String,value:{type:Number,default:0},stage:{type:String,default:"New"},source:String,expectedClose:Date,owner:String},{timestamps:true}));
const Task=mongoose.model("Task",new mongoose.Schema({title:{type:String,required:true},description:String,dueDate:Date,priority:{type:String,default:"Medium"},status:{type:String,default:"Pending"},relatedCustomer:String,owner:String},{timestamps:true}));
const tokenFor=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"});
async function auth(req,res,next){try{let h=req.headers.authorization||"",t=h.startsWith("Bearer ")?h.slice(7):"";let d=jwt.verify(t,process.env.JWT_SECRET);req.user=await User.findById(d.id);if(!req.user)throw Error();next()}catch(e){res.status(401).json({message:"Please sign in again."})}}
app.post("/api/auth/register",async(req,res)=>{try{let {name,email,password}=req.body;if(!name||!email||!password||password.length<6)return res.status(400).json({message:"Enter name, valid email and password (minimum 6 characters)."});email=email.toLowerCase();if(await User.findOne({email}))return res.status(409).json({message:"Email already registered."});let u=await User.create({name,email,password:await bcrypt.hash(password,12)});res.status(201).json({token:tokenFor(u.id),user:{id:u.id,name,email}})}catch(e){res.status(500).json({message:"Could not register."})}});
app.post("/api/auth/login",async(req,res)=>{let u=await User.findOne({email:(req.body.email||"").toLowerCase()});if(!u||!await bcrypt.compare(req.body.password||"",u.password))return res.status(401).json({message:"Incorrect email or password."});res.json({token:tokenFor(u.id),user:{id:u.id,name:u.name,email:u.email}})});
app.get("/api/health",(_,res)=>res.json({status:"ok"}));
const resources={customers:Customer,leads:Lead,tasks:Task};
app.use("/api/:resource",auth,async(req,res,next)=>{try{const Model=resources[req.params.resource];if(!Model)return res.status(404).json({message:"Not found"});const owner=req.user.id;
if(req.method==="GET"){let filter={owner};if(req.query.search){let q=req.query.search;filter.$or=["name","email","company","phone","title","contactName","stage"].map(k=>({[k]:{$regex:q,$options:"i"}}))}return res.json(await Model.find(filter).sort({createdAt:-1}))}
if(req.method==="POST"){let data={...req.body,owner};if(!data.name&&!data.title)return res.status(400).json({message:"A name or title is required."});return res.status(201).json(await Model.create(data))}
if(req.method==="PUT"){let item=await Model.findOneAndUpdate({_id:req.params.id,owner},req.body,{new:true,runValidators:true});return item?res.json(item):res.status(404).json({message:"Record not found."})}
if(req.method==="DELETE"){let item=await Model.findOneAndDelete({_id:req.params.id,owner});return item?res.json({message:"Deleted"}):res.status(404).json({message:"Record not found."})}
next()}catch(e){res.status(400).json({message:"Request failed. Check the fields and try again."})}});
app.get("*",(_,res)=>res.sendFile(path.join(__dirname,"public/index.html")));
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(process.env.PORT||5000,()=>console.log("Nexivo CRM: http://localhost:"+(process.env.PORT||5000)))).catch(e=>{console.error("MongoDB connection error:",e.message);process.exit(1)});

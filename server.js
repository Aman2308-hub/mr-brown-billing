
const express=require("express"),Database=require("better-sqlite3"),path=require("path");
const app=express(),db=new Database("mrbrown.db");app.use(express.json());app.use(express.static("public"));
db.exec(`CREATE TABLE IF NOT EXISTS menu(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,price REAL NOT NULL);
CREATE TABLE IF NOT EXISTS bills(id INTEGER PRIMARY KEY AUTOINCREMENT,bill_no TEXT,date TEXT,customer TEXT,table_no TEXT,payment TEXT,subtotal REAL,discount REAL,total REAL,items TEXT)`);
app.get("/api/menu",(q,s)=>s.json(db.prepare("SELECT * FROM menu ORDER BY name").all()));
app.post("/api/menu",(q,s)=>{let{name,price}=q.body;if(!name||price<0)return s.status(400).json({error:"Invalid"});let r=db.prepare("INSERT INTO menu(name,price) VALUES(?,?)").run(name,price);s.json({id:r.lastInsertRowid,name,price})});
app.put("/api/menu/:id",(q,s)=>{let{name,price}=q.body;db.prepare("UPDATE menu SET name=?,price=? WHERE id=?").run(name,price,q.params.id);s.json({ok:1})});
app.delete("/api/menu/:id",(q,s)=>{db.prepare("DELETE FROM menu WHERE id=?").run(q.params.id);s.json({ok:1})});
app.get("/api/bills",(q,s)=>s.json(db.prepare("SELECT * FROM bills ORDER BY id DESC").all()));
app.post("/api/bills",(q,s)=>{let b=q.body;db.prepare("INSERT INTO bills(bill_no,date,customer,table_no,payment,subtotal,discount,total,items) VALUES(?,?,?,?,?,?,?,?,?)").run(b.bill_no,b.date,b.customer,b.table_no,b.payment,b.subtotal,b.discount,b.total,JSON.stringify(b.items));s.json({ok:1})});
app.get("*",(q,s)=>s.sendFile(path.join(__dirname,"public/index.html")));app.listen(process.env.PORT||3000,()=>console.log("Mr Brown Pro ready"));

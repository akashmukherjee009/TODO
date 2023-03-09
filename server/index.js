const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./utils/jwtGenerator");


//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a todo

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo order by id");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [
      id
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

//Register user
app.post("/register", async (req,res)=>{
  try {
    const {email, password}= req.body
    const checkUser= await pool.query("select * from user_details where user_email= $1",[email])
    // console.log(createUser);
    if (checkUser.rows.length > 0) {
      return res.status(401).send("Email already used!!!!!!!!!")

    } 
    // res.json(req.body)
    const saltRound= 10
    const salt= await bcrypt.genSalt(saltRound)
    const bcryptPassword= await bcrypt.hash(password, salt)
    let createUser= await pool.query("INSERT INTO user_details(user_email, user_pass) values ($1,$2) returning *",[email, bcryptPassword])
    // res.json(createUser.rows[0])
    const token= jwtGenerator(createUser.rows[0].user_id)
    res.json({token})
    
    // res.json(createUser.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})
//Login 
app.post("/login",async(req,res)=>{
  try { 
    const {email,password}= req.body
    const user= await pool.query("select * from user_details where user_email= $1",[email])
    if (user.rows.length==0) {
      return res.status(401).send("Incorrect email and password!!!!!!!!!")
    }
    const validPassword= await bcrypt.compare(password,user.rows[0].user_pass)
    console.log(validPassword);

    if (!validPassword) {
      return res.status(401).send("Incorrect email and password!!!!!!!!!")
    }
    const token= jwtGenerator(user.user_id)
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
    
  }
})













app.listen(5000, () => {
  console.log("server has started on port 5000");
});
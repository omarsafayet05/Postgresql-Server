const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const pool = require("./db");
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});

//GET/books=> return all the books
//GET/books/:id=>return specific book
//POST/books=>create a book
//Delete/books/:id=>delete a book
//PUT/books/:id=> update a book

app.get("/books", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM book");
    res.status(200).json({ message: "Books are returned", data: books.rows });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await pool.query("SELECT * FROM book where id=$1", [id]);
    res.status(200).json({
      message: `specific user is returned with id: ${id}`,
      data: book.rows,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = uuidv4();

    //inserting book into database;
    const newBook = await pool.query(
      "INSERT INTO book(id,name,description) VALUES ($1,$2,$3) RETURNING *",
      [id, name, description]
    );
    res.status(201).json({ message: `Books are created `, data: newBook.rows });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM book where id=$1", [id]);
    res.status(200).json({ message: `Book are deleted with id:${id}` });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedBook = await pool.query(
      "UPDATE book SET name=$1,description=$2 where id=$3 RETURNING*",
      [name, description, id]
    );
    res.status(200).json({
      message: `Books are updated ${name},${description}`,
      data: updatedBook.rows,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

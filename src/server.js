const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "******",
    password: "*******",
    database: "budget_tracker"
});

connection.connect((err) => {
    if (err) {
        console.error("Cannot Connect");
        return;
    }
    else{
        console.log("Connected");
    } 
});

app.delete("/deleteUser/:userId", (req, res) => {
    const user = req.params.userId;
    const query = `DELETE FROM expenses WHERE user_id = '${user}'`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error deleting user: ", error);
            return res.status(500).json({ error: "An error deleting user occured" });
        }
        const query2 = `DELETE FROM users WHERE username = '${user}'`;
        connection.query(query2, (error, result) => {
            if (error) {
                console.error("Error deleting user expenses: ", error);
                return res.status(500).json({ error: "An error deleting user expenses occured" });
            }
            res.json({ message: "Deletion success" });
        });
    });
});

app.get("/registerUser/:userId", (req, res) => {
    const user = req.params.userId;
    const query = `SELECT * FROM users WHERE username = '${user}'`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error querying users: ", error);
            return res.status(500).json({ error: "An error occured" });
        }

        if (results.length > 0) {
            res.json({exists: true});
        }
        else {
            const query2 = `INSERT INTO users (budget, username) VALUES (100, '${user}')`
            connection.query(query2, (error, results) => {
                if (error) {
                    console.error("Error inserting new user: ", error);
                    return res.status(500).json({ error: "An error inserting into users occurred" });
                }
            })
            res.json({exists: false})
        }
    });

})

app.get("/queryUsers/:userId", (req, res) => {
    const user = req.params.userId;
    const query = `SELECT * FROM users WHERE username = '${user}'`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error querying users: ", error);
            return res.status(500).json({ error: "An error querying users occurred" });
        }

        if (results.length > 0) {
            res.json({exists: true});
        }
        else {
            res.json({exists: false})
        }
    });
});

app.delete("/deleteExpense/:itemId", (req, res) => {
    const itemId = req.params.itemId;
    const query = `DELETE FROM expenses WHERE item_id = '${itemId}'`;
    connection.query(query, (err, result) => {
        if (err) {
            console.error("Error deleting item: ", err);
            res.status(500).json({ error: "Error deleting item: " });
            return;
        }
        res.json({ message: "Item deleted successfully" });
    });
});

app.put("/addExpense/:user", (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const fixedName = name.replace(/'/g, "''");
    const cost = req.body.cost
    const user_id = req.params.user
    const query = `INSERT INTO expenses (item_id, name, cost, user_id) VALUES ('${id}', '${fixedName}', ${cost}, '${user_id}')`
    connection.query(query, (err, result) => {
        if (err) {
            console.error("Error adding expense: ", err);
            res.status(500).json({ error: "Error adding expense" });
            return;
        }
        res.json({ message: "Adding expense success" });
    });
});

app.put("/updateBudget/:userId", (req, res) => {
    const updatedBudget = req.body.update;
    const user = req.params.userId;
    const query = `UPDATE users SET budget = ${updatedBudget} WHERE username = '${user}'`;
    connection.query(query, (err, result) => {
        if (err) {
            console.error("Error updating budget:", err);
            res.status(500).json({ error: "Error updating budget" });
            return;
        }
        res.json({ message: "Budget update success" });
    });
});

app.get("/getState/:userID", (req, res) => {
    const user = req.params.userID;
    const query1 = `SELECT budget FROM users WHERE username = '${user}'`;
    connection.query(query1, (err, results) =>{
        if (err){
            console.error("ERROR QUERY1");
            res.status(500).json({error: "ERROR QUERY1"});
            return;
        }
        const budget = results[0].budget;
        const query2 = `SELECT item_id, name, cost FROM expenses WHERE user_id = '${user}'`;
        connection.query(query2, (err, results1) => {
            if (err){
                console.error("ERROR QUERY2")
                res.status(500).json({error: "ERROR QUERY2"});
                return;
            }
            const expenses = results1.map(row => {
                return {
                    id: row.item_id,
                    name: row.name,
                    cost: row.cost
                };
            });
            const combined = {
                budget: budget,
                expenses: expenses
            };
            res.json(combined);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});







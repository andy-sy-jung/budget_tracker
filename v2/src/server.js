const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dbuserdbuser",
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

app.get("/getExpenses/:budget_id/:user_id", (req, res) => {
    const budget_id = req.params.budget_id
    const user_id = req.params.user_id
    const query = `SELECT item_id, name, cost FROM expenses WHERE user_id = '${user_id}' AND budget_id LIKE '${budget_id}%'`
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error getting expenses:", error);
            return res.status(500).json({ error: "An error deleting user occurred" });
        }
        const expenses = results.map(row => {
            return {
                id: row.item_id,
                name: row.name,
                cost: row.cost
            };
        });
        const nameToRemove = "DUMMY"
        const fixedExpenses = expenses.filter(expense => expense.name !== nameToRemove);
        const expensesToReturn = {
            expenses: fixedExpenses,
        }
        res.json(expensesToReturn);
    })
})

app.delete("/deleteBudget/:budget_id/:user_id", (req, res) => {
    const budget_id = req.params.budget_id
    const user_id = req.params.user_id
    const fixedBudget = budget_id.replace(/'/g, "''")
    const query = `DELETE FROM expenses WHERE user_id = '${user_id}' AND budget_id LIKE '${fixedBudget}%'`
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error deleting budget:", error);
            return res.status(500).json({ error: "An error deleting user occurred" });
        }
        res.json({ message: "Deleting budget success" });
    })
})

app.put("/addBudget/:budget_id/:user_id/:amount", (req, res) => {
    const budget_id = req.params.budget_id
    const user_id = req.params.user_id
    const amount = req.params.amount
    const fixedBudget = budget_id.replace(/'/g, "''")
    const dummy_id = uuidv4();
    const query = `INSERT INTO expenses (item_id, name, cost, user_id, budget_id) VALUES ('${dummy_id}', 'DUMMY', 0, '${user_id}', '${fixedBudget}-${amount}')`
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error inserting new budget:", error);
            return res.status(500).json({ error: "An error deleting user occurred" });
        }
        res.json({ message: "Adding budget success" });
    })

})

app.delete("/deleteUser/:userId", (req, res) => {
    const user = req.params.userId;
    const query = `DELETE FROM expenses WHERE user_id = '${user}'`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error deleting user: ", error);
            return res.status(500).json({ error: "An error deleting user occurred" });
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
            const query2 = `INSERT INTO users (budget, username) VALUES (1000, '${user}')`
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

app.put("/addExpense/:user/:budget_id", (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const fixedName = name.replace(/'/g, "''");
    const cost = req.body.cost
    const budget_id = req.params.budget_id
    const fixedBudget = budget_id.replace(/'/g, "''")
    const user_id = req.params.user
    const query = `INSERT INTO expenses (item_id, name, cost, user_id, budget_id) VALUES ('${id}', '${fixedName}', ${cost}, '${user_id}', '${fixedBudget}')`
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
            const nameToRemove = "DUMMY"
            const fixedExpenses = expenses.filter(expense => expense.name !== nameToRemove);
            const query3 = `SELECT DISTINCT budget_id FROM expenses WHERE user_id = '${user}' GROUP BY budget_id`;
            connection.query(query3, (err, results2) => {
                if (err) {
                    console.error("ERROR QUERY3");
                    res.status(500).json({ error: "ERROR QUERY3" });
                    return;
                }
                const budgets = results2.map(row => {
                    return {
                        budget_id : row.budget_id.split("-")[0],
                        amount: row.budget_id.split("-")[1],
                    };
                })
                const combined = {
                    budgets: budgets,
                    budget: budget,
                    expenses: fixedExpenses
                };
                res.json(combined);
            })   
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});







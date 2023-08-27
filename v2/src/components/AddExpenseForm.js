import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const AddExpenseForm = (props) => {
    const { dispatch, user } = useContext(AppContext);
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const onSubmit = (event) => {
        event.preventDefault();
        const expense = {
            name: name,
            cost: parseInt(cost),
            id: uuidv4(),
        };
        dispatch({
            type: "ADD_EXPENSE",
            payload: expense,
        });
        axios.put(`http://localhost:3001/addExpense/${user}/${props.budget_id}-${props.amount}`, expense)
            .then(response => {
                console.log(response);
                setName("");
                setCost("");
            })
            .catch(error => {
                console.error("Error making add request: ", error);
            });
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row ">
                <div className="col-sm d-flex flex-column">
                    <label for="name">Name</label>
                    <input
                        required="required"
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(event)=> setName(event.target.value)}
                    ></input>
                </div>
                <div className="col-sm d-flex flex-column">
                    <label for="cost">Cost</label>
                    <input
                        required="required"
                        type="text"
                        className="form-control"
                        id="cost"
                        value={cost}
                        onChange={(event)=> setCost(event.target.value)}
                    ></input>
                </div>
                <div className="col-sm d-flex flex-column">
                    <button type="submit" className="btn btn-primary mt-auto">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddExpenseForm;
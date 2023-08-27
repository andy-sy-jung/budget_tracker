import React, {useContext, useState} from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const AddBudgetForm = () => {
    const { dispatch, user} = useContext(AppContext);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const onSubmit = (event) => {
        event.preventDefault();
        const budget = {budget_id: name}
        dispatch({
            type: "ADD_BUDGET",
            payload: budget,
        });
        axios.put(`http://localhost:3001/addBudget/${name}/${user}/${amount}`)
            .then(response => {
                console.log(response);
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
                        id="amount"
                        value={amount}
                        onChange={(event)=> setAmount(event.target.value)}
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

export default AddBudgetForm;
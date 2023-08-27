import React, { useContext } from "react";
import { TiDelete } from "react-icons/ti";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ExpenseItem = (props) => {
    const { dispatch } = useContext(AppContext);

    const handleDeleteExpense = () => {
        dispatch({
            type: "DELETE_EXPENSE",
            payload: props.id,
        });
        axios.delete(`http://localhost:3001/deleteExpense/${props.id}`)
            .then(() => {
                props.onDelete(props.id)
            })
            .catch(error => {
                console.error("Error making delete request: ", error)
            });
    };

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            {props.name}
            <div>
                <span className="mr-3">
                    ${props.cost}
                </span>
                <TiDelete size="1.5em" onClick={handleDeleteExpense}></TiDelete>
            </div>
        </li>
    );
};

export default ExpenseItem;
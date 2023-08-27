import React, { useContext, useState } from "react";
import ExpenseItem from "./ExpenseItem";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const ExpenseList = (props) => {
    const expenses = props.expenses
    return (
        <ul className="list-group">
            {expenses.map((expense) => (
                <ExpenseItem 
                    id={expense.id}
                    name={ expense.name}
                    cost={expense.cost}
                    onDelete={props.onDelete}    
                />
            ))}
        </ul>
    );
};

export default ExpenseList;
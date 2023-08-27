import React, { useContext, useState } from "react";
import EditBudget from "./EditBudget";
import ViewBudget from "./ViewBudget";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Budget = () => {
    const { budget, dispatch, user } = useContext(AppContext)
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = (value) => {
        const updateValue = value;
        dispatch({
            type: "SET_BUDGET",
            payload: value,
        })
        axios.put(`http://localhost:3001/updateBudget/${user}`, { update: updateValue })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("Error making budget request: ", error);
            });
        setIsEditing(false);
    };
    

    
    return (
        <div className="alert alert-dark d-flex">
            {isEditing ? (
                <EditBudget handleSaveClick={handleSaveClick} budget={budget} />
            ) : (
                <ViewBudget handleEditClick={handleEditClick} budget={budget} />
            )}     
        </div>
    );
};

export default Budget;
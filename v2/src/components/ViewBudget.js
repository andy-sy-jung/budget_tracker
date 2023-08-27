import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ProgressBar } from "react-bootstrap";

const ViewBudget = (props) => {
    const { expenses, budget } = useContext(AppContext);
    const totalExpenses = expenses.reduce((total, item) => {
        return (total += item.cost);
    }, 0);

    return (
        <div className="container">
            <div className="row mt-3 d-flex align-items-center">
                <div className="col">
                    <span>Budget: ${props.budget}</span>
                </div>
                <div className="col-auto ml-auto">
                    <button type="button" className="btn btn-primary" onClick={props.handleEditClick}>
                        Edit
                    </button>
                </div>
            </div>
            <div className="row mt-3 d-flex align-items-center">
                <div className="col">
                    <ProgressBar
                        className="rounded-pill"
                        variant={getProgressBarVariant(totalExpenses, budget)}
                        min={0}
                        max={budget}
                        now={totalExpenses}
                    />
                </div>
                <div className="col-auto">
                    <span>${totalExpenses} / ${props.budget}</span>
                </div>
            </div>
        </div>
    );
};

function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return "success"
    if (ratio < 0.80) return "warning"
    return "danger"
}

export default ViewBudget;
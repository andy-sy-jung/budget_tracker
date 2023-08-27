import React, { useContext } from "react";
import BudgetCard from "./BudgetCard"
import { AppContext } from "../context/AppContext";

const BudgetList = () => {
    const { budgets } = useContext(AppContext);


    return (
        <ul className="list-group" style={{ listStyle: 'none' }}>
            {budgets.map((budget) => (
                <BudgetCard 
                    budget_id={budget.budget_id}
                    amount={budget.amount}
                />
            ))}
        </ul>
    );
};

export default BudgetList;
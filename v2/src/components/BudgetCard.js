import React, {useState, useContext, useEffect} from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import {Modal, Button, Card, Stack, ProgressBar} from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import AddExpenseForm from "./AddExpenseForm";


const BudgetCard = (props) => {
    const { dispatch, user } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [updatedExpenses, setUpdatedExpenses] = useState([])
    const [totalExpenses, setTotalExpenses] = useState(0)
    const handleClose = () => setShowModal(false);
    useEffect(() => {
        axios.get(`http://localhost:3001/getExpenses/${props.budget_id}/${user}`)
        .then(response => {
            setUpdatedExpenses(response.data.expenses);
            const calculatedTotalExpenses = updatedExpenses.reduce((total, item)=>{
                return (total = total + item.cost)
            }, 0);
            setTotalExpenses(calculatedTotalExpenses);
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        })
    })
    
    

    const onAddExpenseClick = () => {
        setShowModal(true);
        setTitle("Add Expense");
        setMessage(<AddExpenseForm budget_id={props.budget_id} amount={props.amount}/>)
    }
    
    const onViewExpensesClick = () => {
        setShowModal(true);
        setTitle("Expenses");
        setMessage(<ExpenseList expenses={updatedExpenses} onDelete={handleDeletedItem}/>)
    }


    const handleDeletedItem = (deletedId) => {
        axios.get(`http://localhost:3001/getExpenses/${props.budget_id}/${user}`)
        .then(response => {
            const updatedExpensesFromServer = response.data.expenses;
            const updatedList = updatedExpensesFromServer.filter((expense) => expense.id !== deletedId);
            setUpdatedExpenses(updatedList);
            setMessage(<ExpenseList expenses={updatedList} onDelete={handleDeletedItem}/>)
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        })
    };


    const onDeleteBudgetClick = () => {
        dispatch({
            type: "DELETE_BUDGET",
            payload: props.budget_id,
        });
        axios.delete(`http://localhost:3001/deleteBudget/${props.budget_id}/${user}`)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error("Error making delete request: ", error)
            });
    }



    return (
        <li className="mb-2">
            <Card>
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
                        <div className="me-2">{props.budget_id}</div>
                        <div className="d-flex align-items-baseline">
                            $ {totalExpenses}
                            {props.amount && (
                                <span className="text-muted fs-6 ms-1">
                                    / $ {props.amount}
                                </span>
                            )}
                        </div>
                    </Card.Title>
                    {props.amount && (
                        <ProgressBar
                            className="rounded-pill"
                            variant={getProgressBarVariant(totalExpenses, props.amount)}
                            min={0}
                            max={props.amount}
                            now={totalExpenses}
                        />
                    )}
                    <Stack direction="horizontal" gap="2" className="mt-4">
                        <Button
                        variant="outline-primary"
                        className="ms-auto"
                        onClick={onAddExpenseClick}
                        >
                        Add Expense
                        </Button>
                        <Button onClick={onViewExpensesClick} variant="outline-secondary">
                        View Expenses
                        </Button>
                        <Button onClick={onDeleteBudgetClick} variant="outline-danger">
                        Delete Budget
                        </Button>
                    </Stack>
                </Card.Body>
            </Card>
            
            <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {message}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

        </li>
            


    );



};

function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return "success"
    if (ratio < 0.80) return "warning"
    return "danger"
}

export default BudgetCard;
import React, { useContext, useEffect, useState } from "react";
import Budget from "./Budget";
import Remaining from "./Remaining";
import BudgetList from "./BudgetList";
import AddBudgetForm from "./AddBudgetForm";
import { AppContext } from "../context/AppContext";
import {Modal, Button} from "react-bootstrap";
import axios from "axios";


const LoggedIn = () => {
    const { user, dispatch } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);

    useEffect(() =>  {
        axios.get(`http://localhost:3001/getState/${user}`)
            .then(response => {
                dispatch({ type: "SET_INITIAL_STATE", payload: response.data });
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
            });
    }, []);

    const logOut = () => {
        dispatch({
            type: "LOG_OUT",
        });
        localStorage.removeItem("loggedInUser", user)
    }

    const handleDelete = () => {
        axios.delete(`http://localhost:3001/deleteUser/${user}`)
            .then(response => {
                console.log(response);
                setShowModal(false);
                logOut();
            })
            .catch(error => {
                console.error("Error making delete request: ", error)
                setShowModal(false);
                return;
            });
    }

    return (
            <div className="container">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="mt-3">{user}'s Budget Planner</h1>
                    <div className="d-flex">
                        <button className="btn btn-primary" onClick={logOut}>Log Out</button>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-sm">
                        <div className="d-flex flex-column h-100">
                            <Budget />
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-sm">
                        <div className="d-flex flex-column h-100">
                            <Remaining />
                        </div>
                    </div>
                </div>
                <h3 className="mt-3">Budgets</h3>
                <div className="row mt-3">
                    <div className="col-sm">
                         <BudgetList />
                    </div>
                </div>
                <h3 className="mt-3">Add Budget</h3>
                <div className="row mt-3">
                    <div className="col-sm">
                        <AddBudgetForm />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col d-flex justify-content-left">
                        <button className="btn btn-danger" onClick={() => setShowModal(true)}>Delete Profile</button>
                    </div>
                </div>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>WARNING!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete profile?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
    );
};

export default LoggedIn;

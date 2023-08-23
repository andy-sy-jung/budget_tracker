import React, { useContext, useState} from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {Modal, Button} from "react-bootstrap";

const SignIn = () => {
    const { dispatch} = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const handleClose = () => setShowModal(false);

    const onRegister = (event) => {
        event.preventDefault();
        axios.get(`http://localhost:3001/registerUser/${username}`)
            .then(response => {
                if (response.data.exists) {
                    setTitle("Notice");
                    setMessage("User already exits.");
                    setShowModal(true);
                }
                else {
                    setTitle("Notice");
                    setMessage("User succesfully registered!");
                    setShowModal(true);
                }
            })
            .catch(error => {
                console.error("Error registering users: ", error);
            });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        axios.get(`http://localhost:3001/queryUsers/${username}`)
            .then(response => {
                if (response.data.exists) {
                    dispatch({
                        type: "LOG_IN",
                        payload: username,
                    });
                    localStorage.setItem("loggedInUser", username);
                }
                else {
                    setMessage("Entered user does not exist.");
                    setTitle("User not found");
                    setShowModal(true);
                }
            })
            .catch(error => {
                console.error("Error querying for users: ", error);
            });
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="centered-container border p-4 rounded bg-white">
                <form>
                    <div className="form-group mb-3">
                        <label for="user">Username</label>
                        <input
                            className="form-control"
                            id="user"
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary" onClick={onSubmit}>Log In</button>
                        <button className="btn btn-info" onClick={onRegister}>Register</button>
                    </div>
                </form>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default SignIn;

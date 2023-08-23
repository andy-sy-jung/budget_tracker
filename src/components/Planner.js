import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import LoggedIn from "./LoggedIn";
import SignIn from "./SignIn";

const Planner = () => {
    const { dispatch, loggedIn } = useContext(AppContext);
    const [username, setUsername] = useState("");
    
    // const onSubmit = (event) => {
    //     event.preventDefault();
    //     dispatch({
    //         type: "LOG_IN",
    //         payload: username,
    //     });
    //     localStorage.setItem("loggedInUser", username)
    // }

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            dispatch({ type: "LOG_IN", payload: storedUser });
        }
    }, [dispatch]);

    

    return (
        <div>
            {loggedIn ? <LoggedIn /> : <SignIn />}
        </div>
        
    );
};

export default Planner;
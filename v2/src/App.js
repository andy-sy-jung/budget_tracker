import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import Budget from "./components/Budget";
// import Remaining from "./components/Remaining";
// import ExpenseTotal from "./components/ExpenseTotal";
// import ExpenseList from "./components/ExpenseList";
// import AddExpenseForm from "./components/AddExpenseForm";
import { AppProvider} from "./context/AppContext"
import Planner from "./components/Planner";

const App = () => {

  return (
    <AppProvider>
        <Planner/>
    </AppProvider>
  );
};

export default App;
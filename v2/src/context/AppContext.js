import { createContext, useReducer } from "react";

const AppReducer = (state, action) => {
    switch(action.type){
        case "DELETE_BUDGET":
            return{
                ...state,
                budgets: state.budgets.filter(
                    (budget) => budget.budget_id !== action.payload
                ),
            };
        case "ADD_BUDGET":
            return{
                ...state,
                budgets: [...state.budgets, action.payload],
            };
        case "LOG_OUT":
            return{
                ...state,
                user: "",
                loggedIn: false,
            };
        case "LOG_IN":
            return{
                ...state,
                user: action.payload,
                loggedIn: true,
            };
        case "ADD_EXPENSE":
            return{
                ...state,
                expenses: [...state.expenses, action.payload],
            };
        case "DELETE_EXPENSE":
            return{
                ...state,
                expenses: state.expenses.filter(
                    (expense) => expense.id !== action.payload
                ),
            };
        case "SET_BUDGET":
            return{
                ...state,
                budget: action.payload,
            };
        case "SET_INITIAL_STATE":
            return{
                ...state,
                budgets: action.payload.budgets,
                budget: action.payload.budget,
                expenses: action.payload.expenses,
            };
        default:
            return state;
    }
};

export const AppContext = createContext();

const initialState = {
    budgets: [],
    user: "",
    loggedIn: false,
    budget: 0,
    expenses: [],
};

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    return(<AppContext.Provider value={{
        budgets : state.budgets,
        user : state.user,
        loggedIn: state.loggedIn,
        budget: state.budget,
        expenses: state.expenses,
        dispatch,
    }}
    >
        {props.children}
    </AppContext.Provider>
    );
};
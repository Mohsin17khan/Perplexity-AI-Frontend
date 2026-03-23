import Protected from "../auth/components/Protected.jsx";
import Login from "../auth/pages/Login.jsx";
import Register from "../auth/pages/Register";
import Dashboard from "../chat/pages/Dashboard.jsx";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Protected> <Dashboard/> </Protected>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
]);

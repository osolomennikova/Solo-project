import Registration from "./pages/registration/Registration"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    }, {
        path: "/registration",
        element: <Registration />,
    },{
        path: "/login",
        element: <Login />,
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;

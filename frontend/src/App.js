import Registration from "./pages/registration/Registration"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"

import {
    Routes, Route
} from "react-router-dom";


function App() {
    return (
        <>
            <Routes>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
            <div>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;

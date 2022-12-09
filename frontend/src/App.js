import Registration from "./pages/registration/Registration"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"


import {
    Routes, Route, Navigate
} from "react-router-dom";



function App() {
    return (
        <>
            <div>
                <Routes>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<Home/>}/>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    );
}

export default App;

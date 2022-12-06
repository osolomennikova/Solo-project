import {useState} from 'react'
import {useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = () => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                navigate("/");
            })
    }

    return (
        <div className="bg-slate-100 h-screen grid place-content-center">
            <div className="bg-white flex flex-col p-8 shadow-2xl rounded">
                <input value={email} onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder="E-mail"
                       autoComplete="off"
                       className="border-pink-200 outline-pink-500 focus:border-pink-500 border-2 p-3 my-4 rounded text-pink-500"/>
                <input value={password} onChange={(e) => {setPassword(e.target.value)}} type="password"
                       placeholder="Password"
                       className="border-pink-200 outline-pink-500 focus:border-pink-500 border-2 p-3 my-4 rounded text-pink-500"/>
                <button onClick={handleSubmit}
                        className="rounded text-pink-500 outline-pink-500 focus:border-pink-500 my-4 w-auto">Submit
                </button>
            </div>
        </div>
    );
}

export default Login;

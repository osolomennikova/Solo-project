import {useState} from 'react'
import {useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = () => {
        setError('');
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    setError('Неверный логин или пароль')
                    throw new Error('Something went wrong')
                }
            }
        ).then(data => {
            localStorage.setItem('userName', data.userName)
            navigate("/");
        })
    }

    return (
        <div className="bg-slate-100 h-screen grid place-content-center">
            <div className="bg-white flex flex-col p-8 shadow-2xl rounded">
                <input value={email} onChange={(e) => {
                    setEmail(e.target.value)
                }} type="email" placeholder="E-mail"
                       autoComplete="off"
                       className="border-pink-200 outline-pink-500 focus:border-pink-500 border-2 p-3 my-4 rounded text-pink-500"/>
                <input value={password} onChange={(e) => {
                    setPassword(e.target.value)
                }} type="password"
                       placeholder="Password"
                       className="border-pink-200 outline-pink-500 focus:border-pink-500 border-2 p-3 my-4 rounded text-pink-500"/>
                {error && <p className="p-4 text-red-700">{error}</p>}
                <div className="grid content-between">
                <button onClick={handleSubmit}
                        className="rounded text-pink-500 outline-pink-500 focus:border-pink-500 my-4 w-auto">Login
                </button>
                <button onClick={() => navigate("/register")}
                        className="rounded text-pink-500 outline-pink-500 focus:border-pink-500 my-4 w-auto">Register
                </button>

                </div>
            </div>
        </div>
    );
}

export default Login;

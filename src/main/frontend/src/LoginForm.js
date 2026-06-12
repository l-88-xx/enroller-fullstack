import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginForm({ onLogin, buttonLabel }) {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {

        try {
            const response = await fetch('/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    password
                })
            });
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem(
                    'token',
                    result.token
                );
                onLogin(login);
                toast.success('Zalogowano.');

            } else {
                toast.error(
                    'Niepoprawny login lub hasło.'
                );
            }
        } catch (error) {
            toast.error(
                'Nie połączono z serwerem.'
            );
        }
    }

    return (
        <div>
            <label>Login</label>
            <input
                type="text"
                value={login}
                onChange={(e) =>
                    setLogin(e.target.value)
                }
            />
            <label>Hasło</label>
            <input
                type="password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />
            <button
                type="button"
                onClick={handleLogin}
            >
                {buttonLabel || 'Zaloguj'}
            </button>
        </div>
    );
}
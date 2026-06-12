import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    async function handleRegister() {

        try {
            const response = await fetch(
                '/api/participants',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        login,
                        password
                    })
                }
            );
            if (response.ok) {
                toast.success(
                    'Konto utworzone'
                );
                setLogin('');
                setPassword('');
            } else {
                const message =
                    await response.text();
                toast.error(message);
            }
        } catch {
            toast.error(
                'Błąd połączenia z serwerem'
            );
        }
    }
    return (
        <div>
            <h3>Załóż konto</h3>
            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) =>
                    setLogin(e.target.value)
                }
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />
            <button
                type="button"
                onClick={handleRegister}>
                Załóż konto
            </button>
        </div>
    );
}
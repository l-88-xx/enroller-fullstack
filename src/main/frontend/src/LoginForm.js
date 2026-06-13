import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginForm({ onLogin, buttonLabel }) {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

   async function handleLogin() {

   if (!login.trim()) {
       toast.error('Podaj login');
       return;
   }
   if (!password.trim()) {
       toast.error('Podaj hasło');
       return;
   }
   if (login.length > 50) {
       toast.error('Login jest zbyt długi');
       return;
   }
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
               toast.success(
                   'Zalogowano.'
               );
           } else if (response.status === 401) {

               toast.error(
                   'Niepoprawny login lub hasło.'
               );
           } else if (
                 response.status === 401 ||
                 response.status === 403
             ) {
                 toast.error(
                     'Niepoprawny login lub hasło'
                 );
             }
             else {
                 const message =
                     await response.text();
                 toast.error(
                     `Błąd ${response.status}: ${message}`
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
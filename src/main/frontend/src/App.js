import "milligram";
import './App.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";
// obsługa błędów
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from "./RegisterForm";

function App() {
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem('login') || '');

 function login(login) {
     localStorage.setItem(
         'login',
         login);
     setLoggedIn(login);
 }

function logout() {
    localStorage.removeItem('login');
    localStorage.removeItem('token');
    setLoggedIn('');
}

 return (
     <div>
         <ToastContainer
             position="top-right"
             autoClose={3000}
             newestOnTop
             closeOnClick
             pauseOnHover
             theme="colored"
         />
         <h1>System do zapisów na zajęcia</h1>
         {loggedIn
             ? <UserPanel username={loggedIn} onLogout={logout}/>
             : <>
                   <LoginForm onLogin={login}/>
                   <hr />
                   <RegisterForm />
               </>
         }
     </div>
 );
}

export default App;

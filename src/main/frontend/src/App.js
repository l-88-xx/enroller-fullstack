import "milligram";
import './App.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";
// obsługa błędów
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [loggedIn, setLoggedIn] = useState('');

    function login(email) {
        if (email) {
            setLoggedIn(email);
        }
    }

    function logout() {
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
         />

         <h1>System do zapisów na zajęcia</h1>

         {loggedIn
             ? <UserPanel username={loggedIn} onLogout={logout}/>
             : <LoginForm onLogin={login}/>
         }

     </div>
 );
}

export default App;

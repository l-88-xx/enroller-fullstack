import {useState} from "react";
import { toast } from "react-toastify";

export default function NewMeetingForm({onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

 function submit(event) {
     event.preventDefault();

    if (!title.trim()) {
    toast.error("Podaj nazwę spotkania");
    return;
    }

    if (!date) {
    toast.error("Wybierz datę spotkania");
    return;
    }

     onSubmit({
         title,
         description,
         date,
         participants: []
     });
 }

    return (
        <form
            className="form-slide"
            onSubmit={submit}>
            <h3>Dodaj nowe spotkanie</h3>
            <label>Nazwa</label>
            <input type="text" value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <label>Opis</label>
            <textarea value={description}
                      onChange={(e) => setDescription(e.target.value)}></textarea>
            <label>Data spotkania</label>
          <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}/>
            <button>Dodaj</button>
        </form>
    );
}
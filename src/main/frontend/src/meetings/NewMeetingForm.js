import {useState} from "react";

export default function NewMeetingForm({onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    function submit(event) {
        event.preventDefault();

        onSubmit({
            title,
            description,
            date,
            participants: []
        });
    }

    return (
        <form onSubmit={submit}>
            <h3>Dodaj nowe spotkanie</h3>
            <label>Nazwa</label>
            <input type="text" value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <label>Opis</label>
            <textarea value={description}
                      onChange={(e) => setDescription(e.target.value)}></textarea>
            <label>Data spotkania</label>
            <input type="date" value={date}
                       onChange={(e) => setDate(e.target.value)}/>
            <button>Dodaj</button>
        </form>
    );
}
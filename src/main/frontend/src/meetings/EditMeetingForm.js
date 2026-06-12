import { useState } from "react";
import { toast } from 'react-toastify';

export default function EditMeetingForm({
    meeting,
    onSubmit
}) {
    const [title, setTitle] = useState(
        meeting.title
    );
    const [description, setDescription] =
        useState(
            meeting.description
        );
    function submit(event) {
        event.preventDefault();
        if (!title.trim()) {
            toast.error('Podaj nazwę spotkania');
            return;
        }

        if (!description.trim()) {
            toast.error('Podaj opis spotkania');
            return;
        }
        onSubmit({
            ...meeting,
            title,
            description
        });
    }
    return (
        <form
            className="form-slide"
            onSubmit={submit}>
            <h3>Edycja spotkania</h3>
            <label>Nazwa</label>

            <input
                required
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
            />

            <label>Opis</label>
            <textarea
                required
                value={description}
                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }
            />
            <button>
                Zapisz zmiany
            </button>
        </form>
    );
}
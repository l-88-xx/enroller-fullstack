import { useState } from "react";

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
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
            />
            <label>Opis</label>
            <textarea
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
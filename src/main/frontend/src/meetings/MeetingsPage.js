import {useEffect} from "react";
import {useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";
// obsługa błędów
import { toast } from 'react-toastify';
// ładowanie
import Loader from '../components/Loader';

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

// Pobieranie
// useEffect wykonuje tylko przy pierwszym renderowaniu
useEffect(() => {
 const fetchMeetings = async () => {
     setLoading(true);
     try {
         const response = await fetch(`/api/meetings`);

         if (response.ok) {
             const meetings = await response.json();
             setMeetings(meetings);
         } else {
             toast.error('Błąd, nie pobrano spotkań');
         }
     } finally {

         setLoading(false);
     }
 };
    fetchMeetings();
}, []);


//Dodawanie spotkań
async function handleNewMeeting(meeting) {

    const duplicate = meetings.some(
        m =>
            m.title.trim().toLowerCase() === meeting.title.trim().toLowerCase()
            &&
            m.date === meeting.date
    );

    if (duplicate) {
        toast.error('Spotkanie już istnieje w wybranym terminie.');
        return;
    }

    setLoading(true);
    try {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const newMeeting = await response.json();

            const nextMeetings = [...meetings, newMeeting];

            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
            toast.success('Zostało dodane spotkanie');
        } else {
            const message = await response.text();
            toast.error(message);
        }
    } finally {
        setLoading(false);
    }
}

      // Usuwanie spotkań
       async function handleDeleteMeeting(meeting) {
           setLoading(true);
           try {
               const response = await fetch(
                   `/api/meetings/${meeting.id}`,
                   {
                       method: 'DELETE'
                   }
               );
               if (response.ok) {
                   const nextMeetings =
                       meetings.filter(m => m.id !== meeting.id);
                   setMeetings(nextMeetings);
               } else {
                   const message = await response.text();
                   toast.error(message);
               }
           } finally {
               setLoading(false);
           }
       }

        // zapisanie na spotkanie
        async function handleJoinMeeting(meeting) {
        setLoading(true);
            try {
                const response = await fetch(
                    `/api/meetings/${meeting.id}/participants`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            login: username
                        })
                    }
                );

                if (response.ok) {
                    const nextMeetings = meetings.map(m => {
                        if (m.id === meeting.id) {
                            return {
                                ...m,
                                participants: [
                                    ...m.participants,
                                    { login: username }
                                ]
                            };
                        }
                        return m;
                    });

                    setMeetings(nextMeetings);
                } else {
                    const message = await response.text();
                    toast.error(message);
                }
            } catch (error) {
                  toast.error('Nie można połączyć się z serwerem');
              }
              finally {
                  setLoading(false);
              }
        }

        // wypisanie
    async function handleLeaveMeeting(meeting) {
    setLoading(true);

    try {

        const response = await fetch(
            `/api/meetings/${meeting.id}/participants/${username}`,
            {
                method: 'DELETE'
            }
        );

        if (response.ok) {

            const nextMeetings = meetings.map(m => {
                if (m.id === meeting.id) {
                    return {
                        ...m,
                        participants: m.participants.filter(
                            p => p.login !== username
                        )
                    };
                }
                return m;
            });
            setMeetings(nextMeetings);
        } else {
            const message = await response.text();
            toast.error(message);
        }
    } finally {
        setLoading(false);
    }
}
    return (
        <div>

            {loading && (
                <div className="loading-overlay">
                    <Loader />
                </div>
            )}
            <h2>Zajęcia ({meetings.length})</h2>

            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button
                          disabled={loading}
                          onClick={() => setAddingNewMeeting(true)}>
                        Dodaj nowe spotkanie
                      </button>
            }
            {meetings.length > 0 &&
                <MeetingsList
                    meetings={meetings}
                    username={username}
                    onDelete={handleDeleteMeeting}
                    onJoin={handleJoinMeeting}
                    onLeave={handleLeaveMeeting}
                />
            }
        </div>
    )


}
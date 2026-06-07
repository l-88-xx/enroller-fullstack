import {useEffect} from "react";
import {useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";
// obsługa błędów
import { toast } from 'react-toastify';

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

// Pobieranie
// useEffect wykonuje tylko przy pierwszym renderowaniu
useEffect(() => {
    const fetchMeetings = async () => {
        const response = await fetch(`/api/meetings`);
        if (response.ok) {
            const meetings = await response.json();
            setMeetings(meetings);
        }else {
             toast.error('Błąd, nie pobrano spotkań');
         }
    };
    fetchMeetings();
}, []);


//Dodawanie spotkań
async function handleNewMeeting(meeting) {
 const response = await fetch('/api/meetings', {
     method: 'POST',
     body: JSON.stringify(meeting),
     headers: { 'Content-Type': 'application/json' }
 });
 if (response.ok) {
     const newMeeting = await response.json();
     const nextMeetings = [...meetings, newMeeting];
     setMeetings(nextMeetings);
     setAddingNewMeeting(false);
 }else {
      const message = await response.text();
      toast.error(message);
  }
}
      // Usuwanie spotkań
        async function handleDeleteMeeting(meeting) {
            const response = await fetch(`/api/meetings/${meeting.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const nextMeetings = meetings.filter(m => m.id !== meeting.id);
                setMeetings(nextMeetings);
            }else {
                 const message = await response.text();
                 toast.error(message);
             }
        }

        // zapisanie na spotkanie
        async function handleJoinMeeting(meeting) {
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
        }

        // wypisanie
        async function handleLeaveMeeting(meeting) {
            const response = await fetch(`/api/meetings/${meeting.id}/participants/${username}`,
                {
                    method: 'DELETE'
                }
            );
            if (response.ok) {
                const nextMeetings = meetings.map(m => {
                    if (m.id === meeting.id) {
                        return {
                            ...m, participants:m.participants.filter(p => p.login !== username)
                        };
                    }
                    return m;
                });
                setMeetings(nextMeetings);
            }else {
                 const message = await response.text();
                 toast.error(message);
             }
        }


    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onJoin={handleJoinMeeting}
                              onLeave={handleLeaveMeeting}/>}
        </div>
    )
}
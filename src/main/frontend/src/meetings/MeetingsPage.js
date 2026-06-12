import {useEffect} from "react";
import {useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";
// obsługa błędów
import { toast } from 'react-toastify';
// ładowanie
import Loader from '../components/Loader';
import EditMeetingForm from "./EditMeetingForm";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [editingMeeting, setEditingMeeting] = useState(null);
    const token = localStorage.getItem('token');

// Pobieranie
// useEffect wykonuje tylko przy pierwszym renderowaniu
useEffect(() => {
 const fetchMeetings = async () => {
     setLoading(true);
     try {
         const response = await fetch('/api/meetings', {
             headers: {
                 Authorization: `Bearer ${token}`
             }
         });
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
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
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
                       method: 'DELETE',
                       headers: {
                           Authorization: `Bearer ${token}`
                       }
                   }
               );
               if (response.ok) {
                   const nextMeetings =
                       meetings.filter(m => m.id !== meeting.id);
                   setMeetings(nextMeetings);
                   toast.success('Zostało usunięte spotkanie');
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
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
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

        // edycja
        async function handleUpdateMeeting(updatedMeeting) {

        const duplicate = meetings.some(
             m =>
                 m.id !== updatedMeeting.id &&
                 m.title.trim().toLowerCase() ===
                     updatedMeeting.title.trim().toLowerCase()
         );

        if (duplicate) {
            toast.error(
                'Spotkanie o takiej nazwie już istnieje.'
            );
            return;
        }

            const token =localStorage.getItem('token');
            const response = await fetch(
                `/api/meetings/${updatedMeeting.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type':
                            'application/json',
                        Authorization:
                            `Bearer ${token}`
                    },
                    body: JSON.stringify(
                        updatedMeeting
                    )
                }
            );
            if (response.ok) {
                const nextMeetings =
                    meetings.map(m =>
                        m.id === updatedMeeting.id
                            ? updatedMeeting
                            : m
                    );
                setMeetings(nextMeetings);
                setEditingMeeting(null);
                toast.success(
                    'Spotkanie zostało zaktualizowane'
                );
            } else {
                toast.error(
                    'Nie udało się zapisać zmian'
                );
            }
        }

        // wypisanie
    async function handleLeaveMeeting(meeting) {
    setLoading(true);
    try {
        const response = await fetch(
            `/api/meetings/${meeting.id}/participants/${username}`,
          {
              method: 'DELETE',
              headers: {
                  Authorization: `Bearer ${token}`
              }
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

const filteredMeetings = [...meetings]
    .sort((a, b) => {

        if (sortOrder === 'asc') {
            return (
                new Date(a.date) -
                new Date(b.date)
            );
        }
        return (
            new Date(b.date) -
            new Date(a.date)
        );
    })
    .filter(
        meeting =>
            meeting.title
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    );
 
    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <Loader />
                </div>
            )}
            <h2>Zajęcia ({meetings.length})</h2>
            <input
                type="text"
                placeholder="Wyszukaj spotkania..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">
                    Data rosnąco
                </option>
                <option value="desc">
                    Data malejąco
                </option>
            </select>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button
                          disabled={loading}
                          onClick={() => setAddingNewMeeting(true)}>
                        Dodaj nowe spotkanie
                      </button>
            }
            {
                editingMeeting &&
                <EditMeetingForm
                    meeting={editingMeeting}
                    onSubmit={
                        handleUpdateMeeting
                    }
                />
            }
            {meetings.length > 0 &&
               <MeetingsList
                   meetings={filteredMeetings}
                   username={username}
                   onDelete={handleDeleteMeeting}
                   onJoin={handleJoinMeeting}
                   onLeave={handleLeaveMeeting}
                   onEdit={handleEditMeeting}
               />
            }
        </div>
    )

function handleEditMeeting(meeting) {
    setEditingMeeting(meeting);
}
}
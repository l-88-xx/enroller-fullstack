import './MeetingList.css';

export default function MeetingsList({
    meetings,
    username,
    onDelete,
    onJoin,
    onLeave,
    onEdit
})
{
    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                 <th>Data</th>
                  <th>Uczestnicy</th>
                <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {
                meetings.map((meeting, index) => {
                    const joined =
                        meeting.participants.some(
                            p => p.login === username
                        );
                    return (
                        <tr key={index}>
                            <td>{meeting.title}</td>
                            <td>{meeting.description}</td>
                            <td>{new Date(meeting.date).toLocaleDateString('pl-PL')}</td>

                            <td>
                                {meeting.participants.map(p => (
                                    <div key={p.login}>
                                        {p.login}
                                    </div>
                                ))}
                            </td>

                            <td>
                                {
                                    joined
                                        ? <>
                                            <button
                                                type="button"
                                                onClick={() => onLeave(meeting)}
                                            >
                                                Wypisz się
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onEdit(meeting)}
                                            >
                                                Edytuj
                                            </button>
                                          </>

                                        : <>
                                            <button
                                                type="button"
                                                onClick={() => onJoin(meeting)}
                                            >
                                                Zapisz się
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onEdit(meeting)}
                                            >
                                                Edytuj
                                            </button>
                                          </>
                                }
                                {
                                    meeting.participants.length === 0 &&
                                    <button
                                        type="button"
                                        className="button button-outline button-red"
                                        onClick={() => onDelete(meeting)}
                                    >
                                        Usuń
                                    </button>
                                }
                            </td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    );
}
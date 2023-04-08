import axios from 'axios';
import { useEffect, useState } from 'react';

enum Priority {
    high,
    medium,
    low
}

enum Type {
    bug,
    feature,
    other
}

enum Status {
    unadressed,
    in_progress,
    resolved
}

interface CreatedTicketData {
    projectId: string,
    id: string,
    title: string,
    description: string,
    status: Status,
    priority: Priority,
    type: Type,
    creationTime: Date
}

export default function CreatedTickets()
{
    const [ticketList, setTicketList] = useState<CreatedTicketData[]>([]);

    useEffect(() =>{
        const jwt = localStorage.getItem('jwt');

        axios.get(`https://localhost:7047/api/User/GetId?jwt=${jwt}`)
        .then(res => {
            console.log(res.data);
            axios.get(`https://localhost:7047/api/User/GetCreatedTickets?userId=${res.data}`)
            .then(res => {console.log(res.data) 
                setTicketList(res.data)})
                .catch(err =>
                    console.error(err));
        })
        .catch(err =>
            console.error(err))
    }, [])

    return (<div>
        {ticketList.map(ticket => (
            <div key={ticket.id}>{ticket.title} {ticket.description}</div>
        ))}
    </div>);
}
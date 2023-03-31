import { useEffect, useState } from "react";
import axios from 'axios';

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

interface UserData {
    id: string,
    email: string,
    name: string,
    surname: string
}

interface TicketData {
    Id: string,
    Title: string,
    Description: string,
    Priority: Priority,
    Type: Type,
    Status: Status,
    AuthorId: string
    AssignedUsers: UserData[]
}

interface TicketListProps {
    projectId: string | undefined
}

export default function TicketList(props: TicketListProps)
{
    const [projectTickets, setProjectTickets] = useState<TicketData[]>([]);

    useEffect(() => {
        axios.get(`https://localhost:7047/api/Project/GetAssignedTickets?projectId=${props.projectId}`)
        .then(res => {
            console.log(res.data);
            setProjectTickets(res.data);
            const tickets: TicketData[] = res.data;
            if(tickets.length != 0)
            {
                const fetchAssignedUserPromises = tickets.map(ticket=>
                axios.get<UserData[]>(`https://localhost:7047/api/Ticket/GetAssignedUsers?projectId=${ticket.Id}`)
                .then(resp => console.log(resp.data)));
                Promise.all(fetchAssignedUserPromises)
                .then(assignedUsers => tickets.map((ticket, index) => ({
                    ...ticket,
                    AssignedUsers: assignedUsers[index]
                })))
                .catch(err=>console.error(err));
            }
        })
        .catch(err=>console.error(err));
    }, []);

    return (<div className="p-4">
    <table className="text-left w-40 border-collapse table-fixed">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Priority</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2" colSpan={2}>Assigned Users</th>
        </tr>
      </thead>
      <tbody>
        {projectTickets.map(ticket => (
          <tr key={ticket.Id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-2">{ticket.Title}</td>
            <td className="px-4 py-2">{ticket.Description}</td>
            <td className="px-4 py-2">{ticket.Type}</td>
            <td className="px-4 py-2">{ticket.Priority}</td>
            <td className="px-4 py-2">{ticket.Status}</td>
            <td className="px-4 py-2">
              <ul>
                {ticket.AssignedUsers.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </td>
            <td>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>);
}
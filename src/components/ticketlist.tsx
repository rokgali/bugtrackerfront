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
    id: string,
    title: string,
    description: string,
    priority: Priority,
    type: Type,
    status: Status,
    authorId: string,
    assignedUsers?: UserData[]
}

interface TicketListProps {
    projectId: string | undefined
    selectedTicket: TicketData | null;
    onTicketClick: (ticket: TicketData) => void
}

export default function TicketList(props: TicketListProps)
{
    const [projectTickets, setProjectTickets] = useState<TicketData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get<TicketData[]>(`https://localhost:7047/api/Project/GetAssignedTickets?projectId=${props.projectId}`)
        .then(res => {
            console.log(res.data);
            const tickets = res.data;
                const fetchAssignedUserPromises = tickets.map(ticket=>
                axios.get<UserData[]>(`https://localhost:7047/api/Ticket/GetAssignedUsers?ticketId=${ticket.id}`)
                .then(resp => resp.data));
                Promise.all(fetchAssignedUserPromises)
                .then(assignedUsers => {
                  setProjectTickets(tickets.map((ticket, index) => ({
                    ...ticket,
                    assignedUsers: assignedUsers[index]
                })));
                console.log(assignedUsers);
                setIsLoading(false);
            })
                .catch(err=>
                    {console.error(err)
                    setIsLoading(false);});
        })
        .catch(err=>{console.error(err)
        setIsLoading(false)});
    }, []);

    console.log(projectTickets);



    if(isLoading)
    {
        return (<>
        Loading...
        </>)
    }

    return (<div className="p-4">
    <table className="text-left w-full border-collapse table-fixed">
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
        {projectTickets?.map(ticket => (
          <tr 
            key={ticket.id}
            className={`${
              props.selectedTicket?.id === ticket.id ? "bg-blue-100" : ""
            } hover:bg-blue-100`}
            onClick={() => props.onTicketClick(ticket)}
          >
            <td className="px-4 py-2">{ticket.title}</td>
            <td className="px-4 py-2">{ticket.description}</td>
            <td className="px-4 py-2">{Type[ticket.type]}</td>
            <td className="px-4 py-2">{Priority[ticket.priority]}</td>
            <td className="px-4 py-2">{ticket.status == 2 ? "in progress" : Status[ticket.status]}</td>
            <td colSpan={2} className="px-4 py-2">
              <ul>
                {ticket.assignedUsers?.map((user, index) => (
                    <li key={index}>{user.name}</li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>);
}
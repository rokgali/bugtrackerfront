import { useEffect, useState } from "react";
import axios from 'axios';
import CustomModal from "./modal";
import TicketEdit from "./ticketedit";
import EventEmitter from "eventemitter3";

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
    selectedTicket: TicketData | null
    onTicketClick: (ticket: TicketData) => void
    handleSettingTicketList: (ticketList: TicketData[]) => void
    ticketList: TicketData[]
}

export default function TicketList(props: TicketListProps)
{
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const handleTicketList = () => {
      axios.get<TicketData[]>(`https://localhost:7047/api/Project/GetAssignedTickets?projectId=${props.projectId}`)
        .then(res => {
            console.log(res.data);
            const tickets = res.data;
                const fetchAssignedUserPromises = tickets.map(ticket=>
                axios.get<UserData[]>(`https://localhost:7047/api/Ticket/GetAssignedUsers?ticketId=${ticket.id}`)
                .then(resp => resp.data));
                Promise.all(fetchAssignedUserPromises)
                .then(assignedUsers => {
                  props.handleSettingTicketList(tickets.map((ticket, index) => ({
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
    }

    useEffect(() => {
      handleTicketList();
    }, []);

    const handleModalOpen = () => {
      setIsOpen(true);
    }

    const handleModalClosed = () => {
      setIsOpen(false);
    }

    console.log(props.ticketList);



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
        {props.ticketList?.map(ticket => (
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
            <td className="px-4 py-2">{ticket.status == 1 ? "in progress" : Status[ticket.status]}</td>
            <td className="px-4 py-2">
              <ul>
                {ticket.assignedUsers?.map((user, index) => (
                    <li key={index}>{user.name}</li>
                ))}
              </ul>
            </td>
            <td><button onClick={handleModalOpen}>Edit</button></td>
            <CustomModal isOpen={isOpen} onRequestClose={handleModalClosed}>
              <TicketEdit closeModal={handleModalClosed}/>
            </CustomModal>
          </tr>
        ))}
      </tbody>
    </table>
  </div>);
}
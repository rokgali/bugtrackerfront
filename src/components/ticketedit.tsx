import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string,
    email: string,
    name: string,
    surname: string
}

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

interface TicketData {
    id: string,
    title: string,
    description: string,
    priority: Priority,
    type: Type,
    status: Status,
    authorId: string,
    assignedUsers?: User[]
}

interface TicketEditProps {
    closeModal: () => void
    selectedTicket: TicketData | null
}

export default function TicketEdit(props: TicketEditProps)
{
    const handleSubmit = () => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>List of tickets</div>
                <div>Assigned users</div>
                {props.selectedTicket?.assignedUsers?.map((user, index) => (
                    <div key ={uuidv4()}>{index} {user.id} {user.email}</div>
                ))}
                <button type="submit" onClick={props.closeModal}>submit</button>
            </form>
        </div>
    );
}
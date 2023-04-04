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

interface TicketDataProps {
    selectedTicket: TicketData
}

export default function TicketData(props: TicketDataProps)
{
    return (<>
        <div>{props.selectedTicket.title}</div>
        <div>{props.selectedTicket.description}</div>    
    </>);
}
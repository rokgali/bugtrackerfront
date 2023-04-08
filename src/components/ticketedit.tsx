interface TicketEditProps {
    closeModal: () => void
}

export default function TicketEdit(props: TicketEditProps)
{
    const handleSubmit = () => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>List of tickets</div>
                <button type="submit" onClick={props.closeModal}>submit</button>
            </form>
        </div>
    );
}
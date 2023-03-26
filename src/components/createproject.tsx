import { useState } from "react";
import CustomModal from "./modal";

interface Project {
    name: string;
    description: string;
}

export default function CreateProject()
{
    const [isOpen, setIsOpen] = useState(false);

    const handleModalOpen = () => {
        setIsOpen(true);
    }

    const handleModalClosed = () => {
        setIsOpen(false);
    }

    return (
        <>
        <button type="button" className="" onClick={handleModalOpen}>Create new project</button>
        <CustomModal isOpen={isOpen} onRequestClose={handleModalClosed}>
            <div>
                This is some modal data
            </div>
            <button type="button" className="" onClick={handleModalClosed}>Close</button>
        </CustomModal>
        </>
    );
}
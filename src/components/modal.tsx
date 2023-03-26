import Modal from 'react-modal';

interface ModalProps{
    isOpen: boolean,
    onRequestClose: () => void;
    children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({
    isOpen,
    onRequestClose,
    children,
}) => {
    return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    ariaHideApp={false}
    className=""
    overlayClassName=""
    
    >
        {children}
    </Modal>);
}

export default CustomModal;
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './RemoveAdminModal.css';

const RemoveAdminModal = ({ show, handleClose, handleAction, actionType }) => {
    const [reason, setReason] = useState('');

    const onSubmit = () => {
        handleAction(reason);
        setReason(''); // Reset reason after submission
    };

    const getModalText = () => {
        if (actionType === 'ban') {
            return {
                title: 'You are about to ban an admin',
                subtitle: 'Please state your reason on why should ban this admin',
                button: 'Ban Admin'
            };
        }
        return {
            title: 'You are about to unban an admin',
            subtitle: 'Please state your reason on why should unban this admin',
            button: 'Unban Admin'
        };
    };

    const modalText = getModalText();

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="remove-modal-body">
                <h5 className="remove-modal-title">{modalText.title}</h5>
                <p className="remove-modal-subtitle">
                    {modalText.subtitle}
                </p>
                <textarea
                    className="remove-modal-textarea"
                    rows="4"
                    placeholder="Enter reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <button
                    className={`remove-modal-button ${actionType === 'unban' ? 'unban-button' : ''}`}
                    onClick={onSubmit}
                >
                    {modalText.button}
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default RemoveAdminModal;
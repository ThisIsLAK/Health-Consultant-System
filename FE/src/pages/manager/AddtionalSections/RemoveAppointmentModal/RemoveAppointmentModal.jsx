import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './RemoveAppointmentModal.css';

const RemoveAppointmentModal = ({ show, handleClose, handleRemove }) => {
    const [reason, setReason] = useState('');

    const onSubmit = () => {
        handleRemove(reason);
        setReason(''); // Reset reason after submission
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="remove-modal-body">
                <h5 className="remove-modal-title">You are about to remove an appointment</h5>
                <p className="remove-modal-subtitle">
                    Please state your reason on why should remove this appointment
                </p>
                <textarea
                    className="remove-modal-textarea"
                    rows="4"
                    placeholder="Enter reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <button
                    className="remove-modal-button"
                    onClick={onSubmit}
                >
                    Remove
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default RemoveAppointmentModal;
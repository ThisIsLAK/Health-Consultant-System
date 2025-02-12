import React, { useState } from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";

const psychologists = [
    { id: 1, name: "Dr. Richard James", specialty: "General physician" },
    { id: 2, name: "Dr. Jane Smith", specialty: "Clinical Psychologist" },
    { id: 3, name: "Dr. Alex Brown", specialty: "Child Psychologist" },
    { id: 4, name: "Dr. Emily White", specialty: "Neuropsychologist" },
    { id: 5, name: "Dr. John Doe", specialty: "Behavioral Therapist" },
    { id: 6, name: "Dr. Sarah Lee", specialty: "Counseling Psychologist" },
    { id: 7, name: "Dr. Michael Green", specialty: "Forensic Psychologist" },
    { id: 8, name: "Dr. Laura Black", specialty: "Sports Psychologist" }
];

const PsychologistModal = ({ show, handleClose, handleAssign }) => {
    const [selectedPsychologist, setSelectedPsychologist] = useState(null);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Choose a Psychologist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Select a Psychologist to attend the appointment with the following time and date.</p>
                <Row className="g-3">
                    {psychologists.map((psychologist) => (
                        <Col key={psychologist.id} xs={6} md={3}>
                            <Card
                                className={`h-100 ${selectedPsychologist === psychologist.id ? "border-primary shadow" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedPsychologist(psychologist.id)}
                            >
                                <Card.Img
                                    variant="top"
                                    src="https://via.placeholder.com/150" // Replace with real image URL
                                    alt={psychologist.name}
                                />
                                <Card.Body className="text-center">
                                    <Card.Title className="fs-6">{psychologist.name}</Card.Title>
                                    <Card.Text className="text-muted">{psychologist.specialty}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" disabled={!selectedPsychologist} onClick={() => handleAssign(selectedPsychologist)}>
                    Select
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PsychologistModal;

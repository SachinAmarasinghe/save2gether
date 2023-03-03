import React from 'react';
import Toast from 'react-bootstrap/Toast';

function InfoToast(props) {
    return (
        <Toast show={props.show} onClose={props.onClose}>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">{props.heading}</strong>
            </Toast.Header>
            <Toast.Body>{props.body}</Toast.Body>
        </Toast>
    );
}

export default InfoToast;
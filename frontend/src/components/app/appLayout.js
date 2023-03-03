import React, { useState } from 'react';
import InfoToast from '../toast';

function AppLayout({ children }) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ heading: '', body: '' });

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const showInfoToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    return (
        <div>
            {children}
            <InfoToast
                heading={toastMessage.heading}
                body={toastMessage.body}
                show={showToast}
                onClose={handleCloseToast}
            />
        </div>
    );
}

export default AppLayout;
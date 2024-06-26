import React, { useState } from 'react';
import './AddOccurrence.css';

function AddOccurrence({ onSubmit, selectedDate }) {
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [formEnabled, setFormEnabled] = useState(true); // State for form enabled status
    const [loading, setLoading] = useState(false); // State for loading status
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormEnabled(false); // Disable the form fields
        setLoading(true); // Show loading message

        // TODO validate the input

        // Convert duration to a number
        const durationNumber = parseInt(duration, 10);
        // Check if description and duration are provided
        if (description.trim() && !isNaN(durationNumber) && durationNumber > 0) {
            try {
                // Call the onSubmit function passed from the parent component
                await onSubmit({ completed_date: selectedDate, description, duration: durationNumber });
                // Reset form fields
                setDescription('');
                setDuration('');
                setShowSavedMessage(true)
            } catch (error) {
                console.error('Error adding occurrence:', error);
            } finally {
                setLoading(false); // Hide loading message
                setFormEnabled(true); // Re-enable the form fields regardless of success or failure
            }
        }

    };

    return (
        <div className="form-container">
            <div className={`form-overlay.${formEnabled ? '' : 'disabled'}`}>
                <form onSubmit={handleSubmit} className={`form ${formEnabled ? '' : 'disabled'}`}>
                    <div>
                        <label className='form-label'>Date:</label><br />
                        {selectedDate && selectedDate.toDateString()}
                    </div>
                    <div>
                        <label className='form-label'>Description:</label><br />
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className='form-label'>Duration (minutes):</label><br />
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                    <div className='save-button-div'>
                        <button type="submit" disabled={!formEnabled} className='save-button'>Add Occurrence</button>
                    </div>
                </form>
            </div>
            {loading && (
                <div>
                    <p>Saving...</p>
                </div>
            )}
            {showSavedMessage && (
                <div>
                    <p>Saved successfully</p>
                </div>
            )}
        </div>
    );
}

export default AddOccurrence;

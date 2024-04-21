import React, { useState } from 'react';
import './AddOccurrence.css';


function OccurrenceDetails({ occurrence }) {
    console.log(occurrence)
    return (
        <>
            <p>details</p>
            <p>{occurrence.description}</p>
            <p>{occurrence.duration}</p>

        </>
    )

}

export default OccurrenceDetails;

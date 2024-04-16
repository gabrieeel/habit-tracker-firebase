import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { useParams } from 'react-router-dom';
import useAuth from './useAuth';
import Calendar from 'react-calendar';
import './HabitDetails.css'
import AddOccurrence from './AddOccurrence';
import OccurrenceDetails from './OccurrenceDetails';

function HabitDetails() {
    // Access the habit ID from the URL parameters
    const { id } = useParams();
    // console.log("habit id: " + id)

    const { currentUser } = useAuth();
    // console.log(currentUser)

    const [selectedDate, setSelectedDate] = useState(null);
    const [occurrences, setOccurrences] = useState(new Map());
    const [showForm, setShowForm] = useState(false);
    const [showOccurrenceDetails, setShowOccurrenceDetails] = useState(false);
    const [selectedOccurrence, setSelectedOccurrence] = useState(null)
    const [calendarEnabled, setCalendarEnabled] = useState(false); // State for calendar disabled status

    const toggleForm = () => {
        setShowForm(true);
    };

    const onClickDay = (date) => {
        console.log('onClickDay')
        console.log(date) // the date clicked

        var dateStr = date.toDateString();
        if (occurrences.get(dateStr)) {
            // si clickea un dia que tiene ocurrencia, lo muestra(y eventualmente permite borrar)
            console.log("hay occurrence")
            setSelectedOccurrence(occurrences.get(dateStr))
            setShowOccurrenceDetails(true)
        } else {
            // si clickea un dia que no tiene ocurrencias, permite agregar una ocurrencia
            toggleForm();
        }
    };

    const fetchOccurrences = async () => {
        console.log("fetchOccurrences")
        setCalendarEnabled(false)
        try {
            // Construct a Firestore query to fetch occurrences for the specified habit
            const occurrencesQuery = query(
                collection(firestore, 'users', currentUser.uid, 'habits', id, 'occurrences')
            );

            // Execute the query to get occurrences for the habit
            const occurrencesSnapshot = await getDocs(occurrencesQuery);

            // Extract occurrence data from the query snapshot
            const occurrenceData = occurrencesSnapshot.docs.map(doc => doc.data());
            // console.log(occurrenceData)
            // console.log(occurrenceData[0].completed_date.toDate())

            // occurrenceData es [{id:1, description: 'gym', duration: 60, completed_date:new Date()}, {id:2,...}]
            // lo que yo quiero es un map:

            // Convert array to map
            let map = new Map();

            occurrenceData.forEach(occ => {
                console.log(occ.completed_date)
                var key = occ.completed_date.toDate().toDateString();
                console.log(key)
                map.set(key, occ);
            });
            // Update state with fetched occurrences
            console.log(map)
            console.log(map.keys().next().value)
            setOccurrences(map);
        } catch (error) {
            console.error('Error fetching habit occurrences:', error);
        } finally {
            setCalendarEnabled(true)
        }
    };

    useEffect(() => {
        if (currentUser) {
            // Fetch occurrences when the component mounts or when habitId changes
            fetchOccurrences();
        }
    }, [currentUser]);

    const tileClassName =
        ({ activeStartDate, date, view }) => {
            // console.log(activeStartDate, date, view)
            // tengo que ver si esta fecha(8 / 1 x ejemplo) está dentro de una lista de fechas
            if (occurrences.size > 0) {
                // console.log(occurrences)
                // console.log(date.getTime())
                // console.log(occurrences.entries().key)
                if (occurrences.get(date.toDateString())) {
                    console.log("Iguales")
                    return 'red-border'
                }
                return null
            }
            return null
        };

    function handleDateChange(nextValue) {
        console.log('handleDateChange')
        setSelectedDate(nextValue);
    }

    function onActiveStartDateChange({ action, activeStartDate, value, view }) {
        console.log(action)
        console.log(activeStartDate)
        console.log(value)
        console.log(view)
    }

    const handleFormSubmit = async (occurrence) => {
        console.log(occurrence)
        setCalendarEnabled(false); // Disable the calendar
        try {
            // // Add occurrence data to Firestore
            // // await firestore.collection('occurrences').add(occurrence);
            // console.log("ESTOY LLAMANDO A firestore.collection(x).add(x)")
            // await new Promise(r => setTimeout(r, 2000));
            // // Optionally handle success (e.g., show a success message)
            // console.log('Occurrence added successfully:', occurrence);


            // Construct a reference to the occurrences subcollection for the specified habit
            const occurrencesRef = collection(firestore, 'users', currentUser.uid, 'habits', id, 'occurrences');
            // Add a new occurrence document to the occurrences subcollection
            await addDoc(occurrencesRef, occurrence);

            // Fetch occurrences again to reload data
            fetchOccurrences();

        } catch (error) {
            alert("Error")
            console.error('Error adding occurrence:', error);
            // Optionally handle error (e.g., show an error message)
        } finally {
            setSelectedDate(null)
            setShowForm(false)

        }
    };

    const handleUnselect = () => {
        setSelectedDate(null); // Unselect the date
        setShowForm(false);
    };

    return (
        <div class="container">
            <div class="top-div">
                <h2>Habit Details</h2>
                <p>Habit ID: {id}</p>
            </div>
            <div class="middle-div">
                {
                /*occurrences && (
                    <div>
                        <ul>
                            {Array.from(occurrences).map(([completedDate, task], index) => (
                                <li key={index}>{task.description} - {task.duration}</li>
                            ))}
                        </ul>
                    </div>
                )
                */}

                <Calendar
                    className="calendar1"
                    onChange={handleDateChange}
                    onClickDay={onClickDay}
                    onActiveStartDateChange={onActiveStartDateChange}
                    value={selectedDate}
                    tileClassName={tileClassName}
                    tileDisabled={() => !calendarEnabled} // Disable the calendar when calendarEnabled is false


                />
                <button onClick={handleUnselect}>Unselect Date</button>
            </div>
            <div class="bottom-div">
                {showForm && <AddOccurrence onSubmit={handleFormSubmit} selectedDate={selectedDate} />}
                {showOccurrenceDetails && <OccurrenceDetails occurrence={selectedOccurrence} />}
            </div>
        </div>
    );
}

export default HabitDetails;
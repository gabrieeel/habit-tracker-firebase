import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase'; // Import the initialized Firestore instance
import useAuth from './useAuth'; // Import the useAuth hook

function UserHabits() {
    const { currentUser } = useAuth();

    const [habits, setHabits] = useState([]);

    useEffect(() => {
        if (currentUser) {

            const fetchUserHabits = async () => {
                try {
                    // Construct a Firestore query to fetch habits for the specified user ID
                    const habitsQuery = query(
                        collection(firestore, 'users', currentUser.uid, 'habits')
                    );

                    // Execute the query
                    const querySnapshot = await getDocs(habitsQuery);

                    // Extract habit data from query snapshot
                    const habitData = querySnapshot.docs.map(doc => doc.data());

                    // Update state with fetched habits
                    setHabits(habitData);
                } catch (error) {
                    console.error('Error fetching user habits:', error);
                }
            };

            // Fetch user habits when the component mounts or when userId changes
            fetchUserHabits();
        }
    }, [currentUser]); // Dependency array ensures useEffect runs when userId changes

    return (
        <div>
            <h2>User Habits</h2>
            <ul>
                {habits.map((habit, index) => (
                    <li key={index}>{habit.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserHabits;

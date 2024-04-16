import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import firebaseApp, { firebaseAuth } from './firebase';
import { collection, getDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';
import useAuth from './useAuth';

const Home = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
                console.log("uid", uid)
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
            }
        });

    }, [])

    useEffect(() => {
        if (currentUser) {
            const fetchData = async () => {
                try {
                    const userDocRef = doc(firestore, 'users', currentUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {

                        console.log(userDocSnapshot.data());
                    } else {
                        console.log('User document does not exist');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                } finally {
                    setLoading(false); // Hide the loading spinner when data fetching is complete
                }


            };

            fetchData();
        }
    }, [currentUser]);


    return (
        <div>
            {loading ? (
                // Display a loading spinner while data is being fetched
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <div>
                    <div>
                        {currentUser ? (
                            <p>Welcome, {currentUser.email}</p>
                        ) : (
                            <p>Please sign in</p>
                        )}
                    </div>
                    <p>HOME</p>
                    <h2>Data from Firestore</h2>
                    <ul>
                        {/* Render fetched data here */}
                        <li>{JSON.stringify(data)}</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Home
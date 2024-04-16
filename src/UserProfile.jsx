import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import the initialized Firestore instance
import useAuth from './useAuth'; // Assuming you have an AuthContext for managing authentication

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const { currentUser } = useAuth(); // Assume you have a custom hook to get the current user

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(firestore, 'users', currentUser.uid); // Assuming 'users' is the collection name
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        setUserProfile(userDocSnapshot.data());
                    } else {
                        console.log('User document does not exist');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [currentUser]); // Fetch user profile whenever currentUser changes

    return (
        <div>
            <h2>User Profile</h2>
            {userProfile && (
                <div>
                    <p>Name: {userProfile.username}</p>
                    <p>Email: {userProfile.email_address}</p>
                    {/* Render other user information as needed */}
                </div>
            )}
        </div>
    );
}

export default UserProfile;

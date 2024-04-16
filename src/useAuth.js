import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './firebase';

function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        console.log(user)
      setCurrentUser(user);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return { currentUser };
}

export default useAuth;

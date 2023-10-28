import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../utilities/firebase'; // Import db from utilities/firebase.js

export const useAuthState = () => {
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {

            const adminRef = ref(db, 'admin/' + currentUser.uid);
            const snapshot = await get(adminRef);
            
            if (snapshot.exists() && snapshot.val() === true) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
    });

    return () => unsubscribe();

  }, []);

  return [user,isAdmin];
};

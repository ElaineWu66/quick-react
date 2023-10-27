import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthState = () => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);

    return () => unsubscribe();

  }, []);

  return [user];
};

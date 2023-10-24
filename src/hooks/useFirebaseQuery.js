import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../utilities/firebase';

function useFirebaseQuery(path) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const databaseRef = ref(db, path);

    onValue(databaseRef, (snapshot) => {
      setData(snapshot.val());
      setIsLoading(false);
    }, (errorObject) => {
      setError(errorObject.message);
      setIsLoading(false);
    });

    return () => off(databaseRef);
  }, [path]);

  return [data, isLoading, error];
}

export default useFirebaseQuery;
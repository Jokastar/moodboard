"use client"; 
import { useState, useEffect } from 'react';
import { getCollections } from '../_actions/collection';

function useCollections(userId) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getCollections(userId);
        if (result.success) {
          setCollections(result.collections);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch collections');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCollections();
    }
  }, [userId]);

  return { collections, isLoading, error };
}

export default useCollections;
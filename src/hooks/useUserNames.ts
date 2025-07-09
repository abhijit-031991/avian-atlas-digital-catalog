
import { useState, useEffect } from 'react';
import { database } from '@/config/firebase';
import { ref, get } from 'firebase/database';

export const useUserNames = (userIds: string[]) => {
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserNames = async () => {
      if (userIds.length === 0) {
        setUserNames({});
        return;
      }

      setLoading(true);
      const names: Record<string, string> = {};

      try {
        const promises = userIds.map(async (userId) => {
          try {
            const userRef = ref(database, `Users/${userId}/name`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              names[userId] = snapshot.val();
            } else {
              names[userId] = userId; // Fallback to UUID if name not found
            }
          } catch (error) {
            console.error(`Error fetching name for user ${userId}:`, error);
            names[userId] = userId; // Fallback to UUID on error
          }
        });

        await Promise.all(promises);
        setUserNames(names);
      } catch (error) {
        console.error('Error fetching user names:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNames();
  }, [userIds.join(',')]);

  return { userNames, loading };
};

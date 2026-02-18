import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [selectedMall, setSelectedMall] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 100000,
    hasOffer: false
  });
  const [savedItems, setSavedItems] = useState([]);

  // Load saved items when user changes
  useEffect(() => {
    if (currentUser) {
      loadSavedItems();
    } else {
      setSavedItems([]);
    }
  }, [currentUser]);

  const loadSavedItems = async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists() && userDoc.data().savedItems) {
        setSavedItems(userDoc.data().savedItems);
      } else {
        setSavedItems([]);
      }
    } catch (error) {
      console.error('Error loading saved items:', error);
      setSavedItems([]);
    }
  };

  const saveSavedItems = async (items) => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        savedItems: items
      }, { merge: true });
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const toggleSavedItem = (productId) => {
    setSavedItems(prev => {
      const newItems = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      saveSavedItems(newItems);
      return newItems;
    });
  };

  const isSaved = (productId) => {
    return savedItems.includes(productId);
  };

  const clearMallSelection = () => {
    setSelectedMall(null);
    setSelectedFloor(null);
    setSelectedCategory(null);
    setFilters({
      priceMin: 0,
      priceMax: 100000,
      hasOffer: false
    });
  };

  return (
    <UserContext.Provider value={{
      selectedMall,
      setSelectedMall,
      selectedFloor,
      setSelectedFloor,
      selectedCategory,
      setSelectedCategory,
      filters,
      setFilters,
      clearMallSelection,
      savedItems,
      toggleSavedItem,
      isSaved,
      loadSavedItems
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

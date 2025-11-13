import React, { createContext, useState } from "react";

// 1. Create the context
const CompareContext = createContext();

// 2. Create the Provider component
function CompareProvider({ children }) {
  // State to hold the list of breed IDs to compare
  const [compareIds, setCompareIds] = useState([]);

  // 4. Helper function to add a breed (with a max of 3)
  const addCompare = (breedId) => {
    if (!compareIds.includes(breedId) && compareIds.length < 3) {
      setCompareIds([...compareIds, breedId]);
    }
  };

  // 5. Helper function to remove a breed
  const removeCompare = (breedId) => {
    setCompareIds(compareIds.filter((id) => id !== breedId));
  };

  // 6. Helper function to check if a breed is already in the list
  const isInCompare = (breedId) => {
    return compareIds.includes(breedId);
  };

  // 7. Helper function to clear the entire list
  const clearCompare = () => {
    setCompareIds([]);
  };

  // 8. Define the value to be passed to all consuming components
  const contextValue = { 
    compareIds, 
    addCompare, 
    removeCompare, 
    isInCompare,
    clearCompare,
    compareCount: compareIds.length // Pass count for convenience
  };

  return (
    <CompareContext.Provider value={contextValue}>
      {children}
    </CompareContext.Provider>
  );
}

// 9. Export the context and provider
export { CompareContext, CompareProvider };
'use client';

import React, { createContext, useContext } from 'react';

interface FirebaseContextProps {
  firebaseApp: null;
  firestore: null;
  auth: null;
}

const FirebaseContext = createContext<FirebaseContextProps>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

export const FirebaseProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp: null, firestore: null, auth: null }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  return null;
};

export const useFirestore = () => {
  return null;
};

export const useAuth = () => {
  return null;
};

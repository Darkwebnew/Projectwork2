# frontend/context/UserContext.js

import { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Context provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // You can store user info here

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

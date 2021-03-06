import React, { useState, useEffect } from "react";

import Loader from "../Loader";

import { fbase } from "../../firebase";

export const AuthContext = React.createContext({
  currentUser: null,
});

export function AuthProvider({ children }: any) {
  const [currentUserState, setCurrentUserState] = useState<any>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    fbase.auth().onAuthStateChanged((user) => {
      setCurrentUserState(user);
      setBusy(false);
    });
  }, []);

  return (
    <>
      {/* {console.log("Auth Provider")} */}
      {busy === true ? (
        <Loader />
      ) : (
        <AuthContext.Provider
          value={{
            currentUser: currentUserState,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
}

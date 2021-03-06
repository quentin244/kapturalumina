import React, { useState, useEffect, useContext } from "react";

import Loader from "../Loader";

import { AuthContext } from "./AuthProvider";
import { fbase, getCurrentUser } from "../../firebase";

import { Progress } from "../../models";

export const UserProgressContext = React.createContext({
  progress: [] as Progress[],
});

export function UserProgressProvider({ children }: any, props: any) {
  const { currentUser } = useContext(AuthContext);
  const [progressState, setProgressState] = useState<Progress[]>([]);
  const [busy, setBusy] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      fbase
        .database()
        .ref("users/" + user.uid + "/progress")
        .on("value", (snapshot) => {
          setProgressState([]);
          snapshot.forEach((row) => {
            setProgressState((prog) => [...prog, row.val()]);
          });
        });
    } else {
      setProgressState([]);
    }
    setBusy(false);
  }, [currentUser, user]);

  return (
    <>
      {/* {console.log("UserProgressProvider", progressState, user?.uid)} */}
      {busy ? (
        <Loader />
      ) : (
        <UserProgressContext.Provider
          value={{
            progress: progressState,
          }}
        >
          {children}
        </UserProgressContext.Provider>
      )}
    </>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, where } from "firebase/firestore";
import { firestore } from "../config/firebase";

const DoxContext = createContext();
export default function DoxContextProvider(props) {
  const [documents, setDocuments] = useState([]);
  // -------------------------------- get task doc ------------------

  useEffect(() => {
    fatchDoc();
  }, []);
  const userUid = "user's_uid_here";

  const fatchDoc = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "todos"),
      where("user.uid", "==", userUid)
    );
    const array = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let data = doc.data();
      array.push(data);
    });
    setDocuments(array);
  };

  return (
    <DoxContext.Provider value={{ documents }}>
      {props.children}
    </DoxContext.Provider>
  );
}

export const UesDoxContext = () => useContext(DoxContext);

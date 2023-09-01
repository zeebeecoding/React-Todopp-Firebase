import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from "config/firebase";
import Sidebar from "./Sidbar";

export default function Index() {
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // Fetch lists data from Firebase
    const fetchLists = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "lists"));
        const fetchedLists = querySnapshot.docs.map((doc) => doc.data());
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "todos"),
      (querySnapshot) => {
        const array = querySnapshot.docs.map((doc) => doc.data());
        setDocuments(array);
        setAllDocuments(array);
      }
    );

    return () => {
      unsubscribe(); // Cleanup the listener when component unmounts
    };
  }, []);
  return (
    <>
      <Sidebar listsProp={lists} />
    </>
  );
}

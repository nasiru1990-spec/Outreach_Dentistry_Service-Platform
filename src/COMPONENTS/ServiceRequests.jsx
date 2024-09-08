import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState("");
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(
      collection(db, "serviceRequests"),
      where("dentistId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsList);
    });

    return () => unsubscribe();
  }, [db, user.uid]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (newRequest.trim() === "") return;

    try {
      await addDoc(collection(db, "serviceRequests"), {
        description: newRequest,
        dentistId: user.uid,
        status: "pending",
        createdAt: new Date(),
      });
      setNewRequest("");
    } catch (error) {
      console.error("Error adding service request: ", error);
    }
  };

  return (
    <div className="service-requests">
      <h2>Service Requests</h2>
      <form onSubmit={handleSubmitRequest}>
        <input
          type="text"
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          placeholder="Describe your service request..."
        />
        <button type="submit">Submit Request</button>
      </form>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request.id} className="request">
            <p>{request.description}</p>
            <p>Status: {request.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceRequests;

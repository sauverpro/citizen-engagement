import React, { createContext, useContext, useState } from 'react';

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);

  const setAllComplaints = (data) => setComplaints(data);
  const addComplaint = (complaint) => setComplaints((prev) => [...prev, complaint]);
  const updateComplaint = (id, updates) => setComplaints((prev) => prev.map(c => c.id === id ? { ...c, ...updates } : c));

  return (
    <ComplaintContext.Provider value={{ complaints, setAllComplaints, addComplaint, updateComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaintContext() {
  return useContext(ComplaintContext);
}

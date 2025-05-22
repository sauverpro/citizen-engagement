import React, { useEffect } from 'react';
import ComplaintList from '../../components/complaints/ComplaintList.jsx';
import { useAuthContext } from '../../hooks/useAuth.js';
import { getComplaints } from '../../api/complaints.js';
import { useComplaintContext } from '../../contexts/ComplaintContext.jsx';

export default function ComplaintsPage({ complaints }) {
  const { user } = useAuthContext();
  const { setAllComplaints } = useComplaintContext();

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = (user && user.token) ? user.token : localStorage.getItem('token');
      if (!token) return;
      try {
        const data = await getComplaints(token);
        setAllComplaints(data);
      } catch {
        // Optionally handle error
      }
    };
    fetchComplaints();
  }, [user, setAllComplaints]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Complaints</h2>
      <ComplaintList complaints={complaints} />
    </div>
  );
}

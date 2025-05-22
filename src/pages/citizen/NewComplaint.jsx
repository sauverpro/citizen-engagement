import React from 'react';
import ComplaintForm from '../../components/complaints/ComplaintForm.jsx';

export default function NewComplaint({ onSubmit }) {
  return (
    <div className="p-4 max-w-xl mx-auto"> 
      <ComplaintForm onSubmit={onSubmit} />
    </div>
  );
}

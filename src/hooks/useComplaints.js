import { useContext } from 'react';
import { ComplaintContext } from '../contexts/ComplaintContext.jsx';

export default function useComplaints() {
  return useContext(ComplaintContext);
}

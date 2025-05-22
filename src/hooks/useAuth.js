import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextContext.js';

export function useAuthContext() {
  return useContext(AuthContext);
}

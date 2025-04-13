// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunc(...args);
        setData(result.data || result);
        
        return result;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
        showToast(err.response?.data?.message || err.message || 'An error occurred', 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, showToast]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi;
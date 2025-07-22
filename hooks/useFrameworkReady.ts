import { useEffect } from 'react';

export function useFrameworkReady() {
  // Empty hook - removed web-specific logic that was causing context issues
  useEffect(() => {
    // No-op for Expo compatibility
  }, []);
}
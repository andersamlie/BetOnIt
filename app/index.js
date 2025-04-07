import { useEffect } from 'react';
import { useRouter, Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '../authContext';

export default function Index() {
  const { user } = useAuth(); // Check if user is logged in
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Ensure layout is ready

  useEffect(() => {
    if (!navigationState?.key) return; // Prevent navigation before layout mounts

    if (user) {
      router.replace('/MyBetsScreen'); // Navigate to Home if logged in
    } else {
      router.replace('/screens/auth/LoginScreen'); // Navigate to Login if not
    }
  }, [user, navigationState]);

  return null; // No UI needed, just redirects
}

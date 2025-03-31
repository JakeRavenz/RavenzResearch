

import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export default function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Get the current session
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        setAuthState({ user: null, loading: false });
        return;
      }
      
      if (data && data.session) {
        setAuthState({ user: data.session.user, loading: false });
      } else {
        setAuthState({ user: null, loading: false });
      }
    };

    fetchUser();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({ 
          user: session?.user || null, 
          loading: false 
        });
      }
    );

    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return authState;
}
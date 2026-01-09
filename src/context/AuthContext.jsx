import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
// Helper function to convert role selection to proper role name
const getRoleFromSelection = (roleSelection) => {
  switch (roleSelection) {
    case 'employee':
      return 'Employee';
    case 'marketing':
      return 'Marketing Manager';
    case 'production':
      return 'Production Manager';
    case 'owner':
      return 'Owner';
    default:
      return 'Employee'; // Default fallback
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        // Check if there's a user in localStorage
        const storedUser = localStorage.getItem('cattleFeedUser');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user:', error);
          }
        } else {
          // Check Supabase session
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session) {
            // Get user role from employees table
            const { data: employee, error: empError } = await supabase
              .from("emp_profile")
              .select()
              .eq("user_id", session.user.id)
              .maybeSingle();

            if (empError) throw empError;

            if (employee) {
              const userData = {
                id: session.user.id,
                email: session.user.email,
                fullName: employee.full_name || session.user.user_metadata?.full_name || 'User',
                role: employee.role,
              };

              localStorage.setItem('cattleFeedUser', JSON.stringify(userData));
              setUser(userData);
            }
          }
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
        // Clear stored user if there's an error
        localStorage.removeItem('cattleFeedUser');
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();
  }, []);

  // Login function - uses Supabase for authentication
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      const user = data.user;

      // Check role from employees table
      const { data: employee, error: empError } = await supabase
        .from("emp_profile")
        .select()
        .eq("email", email.trim())
        .maybeSingle();

      if (empError) throw empError;
      if (!employee) {
        await supabase.auth.signOut();
        throw new Error("Your account is not approved by admin");
      }

      // Attach user_id if not set
      if (!employee.user_id) {
        await supabase
          .from("emp_profile")
          .update({ user_id: user.id })
          .eq("email", email.trim());
      }

      // Create user object with role
      const userData = {
        id: user.id,
        email: user.email,
        fullName: employee.full_name || user.user_metadata?.full_name || 'User',
        role: employee.role,
      };

      // Store user in localStorage
      localStorage.setItem('cattleFeedUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Signup function - uses Supabase for authentication
  const signup = async (fullName, email, password) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: { data: { full_name: fullName.trim() } },
      });

      if (error) throw error;

      const user = data.user;

      // Get selected role from localStorage
      const selectedRole = localStorage.getItem('selectedRole') || 'Employee';

      // Insert user into employees table with role
      const { error: insertError } = await supabase
        .from('emp_profile')
        .insert([{
          email: email.trim(),
          full_name: fullName.trim(),
          role: getRoleFromSelection(selectedRole),
          user_id: user.id,
        }]);

      if (insertError) {
        // If insertion fails, sign out the user
        await supabase.auth.signOut();
        throw insertError;
      }

      // Create user object
      const userData = {
        id: user.id,
        email: user.email,
        fullName: fullName,
        role: getRoleFromSelection(selectedRole),
      };

      // Store user in localStorage
      localStorage.setItem('cattleFeedUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.message || 'Signup failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Error signing out from Supabase:', error);
    } catch (error) {
      console.error('Error during logout:', error);
    }

    // Clear user from localStorage
    localStorage.removeItem('cattleFeedUser');
    setUser(null);
  };

  // Value to be provided to consumers
  const value = {
    user,
    login,
    signup,
    logout,
    authError,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
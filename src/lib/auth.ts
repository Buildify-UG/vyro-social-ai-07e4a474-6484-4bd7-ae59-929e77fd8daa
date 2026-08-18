import { supabase } from './supabase';
import { User } from '@/types';

export async function signUp(email: string, password: string, username: string) {
  try {
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Create user record
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        username,
        password_hash: 'hashed_by_auth',
      });

    if (userError) throw userError;

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        display_name: username,
      });

    if (profileError) throw profileError;

    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) return null;
    return user;
  } catch {
    return null;
  }
}

export async function updateProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

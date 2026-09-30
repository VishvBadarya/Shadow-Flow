import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../db/supabase.js';

// Model logic combined into Controller for simplicity in MVC, 
// though ideally this DB logic could go into a separate User model class.

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Use bcrypt to hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert into Supabase
    // Note: If using Supabase Auth, you'd use supabase.auth.signUp() instead.
    // For this MVC architecture demo, we insert directly into a custom users table.
    const { data, error } = await supabase
      .from('custom_users')
      .insert([
        { email, password_hash: hashedPassword, role: role || 'STAFF' }
      ])
      .select('id, email, role')
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ error: 'Database error while registering user' });
    }

    res.status(201).json({ message: 'User registered successfully', user: data });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Compare passwords using bcrypt
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Passwords match, proceed with login (e.g., issue JWT or session)
    res.status(200).json({ 
      message: 'Login successful', 
      user: { id: user.id, email: user.email, role: user.role } 
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

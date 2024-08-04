// components/Login.js
'use client';
import { useState } from 'react';
import { Box, Typography, Button, Container, TextField, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful");
      router.push('/dashboard'); // Change this to your desired route
    } catch (error) {
      console.error('Error logging in:', error);
      alert("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Login Successful");
      router.push('/dashboard'); // Change this to your desired route
    } catch (error) {
      console.error('Error with Google login:', error);
      alert("Google login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        boxShadow={3}
        padding={4}
        borderRadius={2}
        bgcolor="white"
      >
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Stack spacing={2} width="100%">
          <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            label="Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
        </Stack>
        <Typography variant="body2" mt={2}>
          Don't have an account? <a href="#" onClick={() => router.push('/signup')}>Sign up</a>
        </Typography>
      </Box>
    </Container>
  );
}

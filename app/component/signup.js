// components/Signup.js
'use client';
import { useState } from 'react';
import { Box, Typography, Button, Container, TextField, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import Image from 'next/image';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign Up Successful");
      router.push('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      alert("Sign up failed");
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
          Sign Up
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
          <TextField 
            label="Confirm Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRegister}
          >
            Sign Up
          </Button>
        </Stack>
        <Typography variant="body2" mt={2}>
          Already have an account? <a href="#" onClick={() => router.push('/login')}>Login</a>
        </Typography>
      </Box>
    </Container>
  );
}

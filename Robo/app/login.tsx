import { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, Text, View, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // 🔥 Ensure this path is correct

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('./home'); // ✅ Navigate to Home on success
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/robot-logo.png')}
          style={styles.reactLogo}
        />
        <ThemedText type="title">Login</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.formContainer}>
        <ThemedText type="subtitle">Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <ThemedText type="subtitle">Password</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ThemedText  type="buttonText">Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedView style={styles.footerContainer}>
        <ThemedText>
          Don't have an account?{' '}
          <ThemedText style={styles.link} type="linkText" onPress={() => router.push('/register')}>
            Sign up
          </ThemedText>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  reactLogo: {
    height: 200,
    width: 160,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#B4A7D6',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3, // For shadow effect on Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: 'blue',
  },
});

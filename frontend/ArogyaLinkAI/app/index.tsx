import React, { useState } from 'react';
import { router } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

export default function LoginScreen() {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleLogin = async () => {

    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      router.push('/dashboard');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        style={{ flex: 1 }}
      >

        <ScrollView
          contentContainerStyle={
            styles.scrollContainer
          }
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.card}>

            <View style={styles.logoCircle}>
              <Ionicons
                name="medical"
                size={34}
                color="#fff"
              />
            </View>

            <View style={styles.brandContainer}>

              <Text style={styles.title}>
                ASHA+
              </Text>

              <Text style={styles.subtitle}>
                Empowering rural healthcare
              </Text>

            </View>

            <View style={styles.inputWrapper}>

              <Ionicons
                name="mail-outline"
                size={20}
                color="#7a7a7a"
              />

              <TextInput
                placeholder="Email or Mobile Number"
                placeholderTextColor="#8a8a8a"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />

            </View>

            <View style={styles.passwordContainer}>

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#7a7a7a"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#8a8a8a"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Text style={styles.showText}>
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </Text>
              </TouchableOpacity>

            </View>

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
            >

              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>
                  Login
                </Text>
              )}

            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dff5f0',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 36,
    padding: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: '#19a38c',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },

  brandContainer: {
    alignItems: 'center',
    marginBottom: 34,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    marginTop: 6,
    color: '#6b6b6b',
    fontSize: 15,
  },

  inputWrapper: {
    backgroundColor: '#f5f7f7',
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  input: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 12,
    fontSize: 16,
  },

  passwordContainer: {
    backgroundColor: '#f5f7f7',
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 12,
    fontSize: 16,
  },

  showText: {
    color: '#19a38c',
    fontWeight: '600',
  },

  error: {
    color: '#ff4d4d',
    marginBottom: 15,
    marginLeft: 4,
  },

  loginBtn: {
    backgroundColor: '#19a38c',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },

  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  forgotText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#19a38c',
    fontWeight: '500',
  },
});
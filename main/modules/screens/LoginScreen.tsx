import React, {useState, useCallback} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
// import {useAuth} from '../../App';
import {useAuth} from '../../../src/navigation/AuthContext';
import Icon from '../../../src/component/Icon';
import {defaultSpace} from '../../../src/lib/deviceHelper';
import {Colors} from '../../../src/constants/Colors';

export default function LoginScreen() {
  const {login, register, loading} = useAuth();
  const [email, setEmail] = useState('dummy@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  // Memoize the Icon component to prevent re-rendering
  const BurgerIcon = useCallback(() => {
    return <Icon name="burger" size={380} noColor />;
  }, []);

  const submit = async () => {
    try {
      setError('');
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, phone);
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <BurgerIcon />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Welcome!</Text>
        <Text style={styles.subtitleText}>
          Sign in to continue to your account
        </Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={submit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>
                {isLogin ? 'Continue' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Login/Register Switch */}
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: defaultSpace,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  burgerImage: {
    width: 200,
    height: 200,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.orange, // Orange color similar to the button in the image
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: Colors.orange,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 15,
    color: '#4267B2',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { View, Button, StyleSheet } from 'react-native';

// Ensure the auth session is completed when returning from the browser
WebBrowser.maybeCompleteAuthSession();

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '--- IGNORE ---',  
      scopes: ['openid', 'profile', 'email'], 
      redirectUri: makeRedirectUri({
        scheme: 'your.app',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      // Send the authorization code to your backend FastAPI server
      const sendCodeToBackend = async () => {
        const response = await fetch('https://your-backend-url.com/oauth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),  // Send the authorization code to the backend
        });

        const data = await response.json();
        console.log('Backend response:', data);
        // You can now handle the data, store the session, etc.
      };

      sendCodeToBackend();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        disabled={!request}
        title="Login with Google"
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
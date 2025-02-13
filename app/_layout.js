import { Slot, Stack } from 'expo-router';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';
import { useState, useEffect, useContext } from 'react';
import SplashScreen from '../components/SplashScreen';

function RootLayoutNav() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!userToken ? (
        // Routes non authentifiées
        <Stack.Screen
          name="(auth)"
        />
      ) : (
        // Routes authentifiées
        <>
          <Stack.Screen
            name="index"
          />
          <Stack.Screen
            name="cardList"
          />
          <Stack.Screen
            name="profile"
          />
          <Stack.Screen
            name="set/[id]"
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
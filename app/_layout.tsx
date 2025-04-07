import { AuthProvider } from "../authContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="screens/auth/LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="screens/auth/SignUpScreen" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

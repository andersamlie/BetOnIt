import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { logIn } from "../../../authService";
import { useRouter } from "expo-router";

const LoginScreen = () => {
const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await logIn(email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace("../../(tabs)/MyBetsScreen"); 
    } catch (error: unknown) {
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An unexpected error occurred.");
        }
      }
  };

  return (
    <View style={{ padding: 20, marginTop: 200 }}>
        <Text style={{ fontWeight: "bold", fontSize: 48 }}>BetOnIt</Text>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <Text>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginBottom: 20 }} />
      <Button title="Log In" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => router.replace("./SignUpScreen")} />
    </View>
  );
};

export default LoginScreen;

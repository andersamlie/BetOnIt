import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, TouchableOpacity, StyleSheet, Image } from "react-native";
import { signUp } from "../../../authService"; // Assuming this handles Firebase auth sign up
import * as ImagePicker from 'expo-image-picker'; // For image picker functionality
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { g8 } from "@/app/assets/color";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [pfp, setPfp] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const router = useRouter();

  // Handle profile picture selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPfp(result.assets[0].uri); // Save the selected image URI
    }
  };

  // Create a user in Firebase
  const handleSignUp = async () => {
    if (password === "" || email === "" || username === "" || firstName === "" || lastName === "" || pfp === "" || age === "") {
      Alert.alert(
          "Incomplete Information",
          "Some required information is missing. Please complete all fields before submitting.",
          [
            { text: "Cancel", style: "cancel" },
          ]
        );
      return;
    }

    try {
      const user = await signUp(email, password); // Assuming this is handled by Firebase Auth

      const response = await fetch(pfp);
      const blob = await response.blob();

      // Create a storage ref using the user ID
      const pfpRef = ref(storage, `profilePictures/${user.uid}.jpg`);

      // Upload the blob
      await uploadBytes(pfpRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(pfpRef);
      
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        profilePic: downloadURL, // Optional: default profile picture
        createdAt: new Date(),
        firstName: firstName,
        lastName: lastName,
        age: age

      });

      Alert.alert("Success", "Account created successfully!");
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
    <View style={{ padding: 20, marginTop: 110 }}>
       <View style={{alignItems: 'center'}}>
        {pfp && <Image source={{ uri: pfp }} style={styles.imagePreview} />}
        </View>
      <Text style={styles.label}>Upload Profile Pic</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.buttonText}>{!pfp ? `Choose Pic` : `Change Pic`}</Text>
        </TouchableOpacity>

      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text>First Name:</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <Text>Last Name:</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Text>Age:</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      

      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Back to Login" onPress={() => router.replace("/screens/auth/LoginScreen")} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 80,
  },
  imagePicker: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 2,
    color: g8,
    fontWeight: "600",
  },
  buttonText: {
    color: g8,
    fontSize: 16,
  },

});

export default SignUpScreen;

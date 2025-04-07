import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, FlatList } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // Import Image Picker
import DateTimePicker from "@react-native-community/datetimepicker"; // Import Date Picker
import { bg, g8 } from "../assets/color";
import { createBet } from "../firebaseServices";

export default function CreateScreen() {
  const [betName, setBetName] = useState("");
  const [betDescription, setBetDescription] = useState("");
  const [betPhoto, setBetPhoto] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [verificationType, setVerificationType] = useState(null);
  const [items, setItems] = useState([
    {label: 'Photo/Video Evidence', value: 'evidence'},
    {label: 'Majority Vote', value: 'majority'},
    {label: 'Everyone Verifies', value: 'everyone'},
    {label: 'Certification', value: 'certification'},
    {label: 'Bet Owner Verification', value: 'owner'}
  ]);
  const [betType, setBetType] = useState(null);
    const betTypeItems = [
    { label: 'Two Outcome - spreads, moneylines, O/Us, etc.', value: 'two_outcome'},
    { label: 'Multi Outcome - futures, props, etc.', value: 'multi_outcome' }
    ];

    const [outcome1, setOutcome1] = useState("");
    const [outcome2, setOutcome2] = useState("");

    // For "Multi Outcome" type
    const [multiOutcomes, setMultiOutcomes] = useState([]);
    const [currentOutcome, setCurrentOutcome] = useState("");

    const handleAddOutcome = () => {
        if (currentOutcome.trim() !== "") {
            setMultiOutcomes([...multiOutcomes, currentOutcome.trim()]);
            setCurrentOutcome(""); // Clear input
        }
    };  

  const onChangeStartDate = (event, selectedDate: Date) => {
    if (selectedDate && selectedDate >= new Date()) {
      setStartDate(selectedDate);

      // Automatically update endDate if it's before new startDate
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
    setShowStartPicker(false);
  };

  const onChangeEndDate = (event, selectedDate: Date) => {
    if (selectedDate && selectedDate >= startDate) {
      setEndDate(selectedDate);
    }
    setShowEndPicker(false);
  };

  const router = useRouter();

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setBetPhoto(result.assets[0].uri); // Save the selected image URI
    }
  };

  const handleSubmit = () => {
    if (betName === "" || !verificationType || startDate === endDate) {
        Alert.alert(
            "Incomplete Information",
            "Some required information is missing. Please complete all fields before submitting.",
            [
              { text: "Cancel", style: "cancel" },
            ]
          );
        return;
    }
    const betData = {
        betName,
        betDescription,
        verificationType,
        startDate,
        endDate,
        betPhoto,
    };
    
    createBet(betData);

    router.push("../screens/bets/BetCreationSuccessScreen")
  };
  DropDownPicker.setListMode("SCROLLVIEW");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Bet</Text>
      <ScrollView>
        {/* Bet Title Input */}
        <Text style={styles.label}>Bet Title - Required</Text>
        <TextInput style={styles.input} placeholder="Enter bet title" value={betName} onChangeText={setBetName} />

        {/* Bet Description Input */}
        <Text style={styles.label}>Description - Optional</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter bet description"
          value={betDescription}
          onChangeText={setBetDescription}
          multiline
        />

        {/* Image Upload */}
        <Text style={styles.label}>Upload Image - Optional</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>

        <View style={{alignItems: 'center'}}>
        {betPhoto && <Image source={{ uri: betPhoto }} style={styles.imagePreview} />}
        </View>

        <Text style={styles.label}>Bet Type - Required</Text>
        <DropDownPicker
            open={open2}
            value={betType}
            items={betTypeItems}
            setOpen={setOpen2}
            setValue={setBetType}
            setItems={() => betTypeItems}
            zIndex={3000} 
        />

        <View>
        {betType === "two_outcome" ? (
            // Two TextInputs side by side
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TextInput
                style={styles.input}
                placeholder="Outcome 1"
                value={outcome1}
                onChangeText={setOutcome1}
            />
            <TextInput
                style={styles.input}
                placeholder="Outcome 2"
                value={outcome2}
                onChangeText={setOutcome2}
            />
            </View>
        ) : betType === "multi_outcome" ? (
            <View>
            {/* Input to add list items */}
            <TextInput
                style={styles.input}
                placeholder="Enter an outcome and press Enter"
                value={currentOutcome}
                onChangeText={setCurrentOutcome}
                onSubmitEditing={handleAddOutcome} // Adds item on Enter
            />

            {/* Display entered outcomes */}
            <FlatList
                data={multiOutcomes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
            />
            </View>
        ) : null}
        </View>


        {/* Type of Verification Picker */}
        <Text style={styles.label}>Verification Type - Required</Text>
        <DropDownPicker
            open={open}
            value={verificationType}
            items={items}
            setOpen={setOpen}
            setValue={setVerificationType}
            setItems={setItems}
            zIndex={2000}
        />

        <Text style={styles.label}>Start Time - Required</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.buttonText}>{startDate.toLocaleString()}</Text>
        </TouchableOpacity>

        {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="default"
          onChange={onChangeStartDate}
          minimumDate={new Date()} // Prevents selecting past dates
          style={{ marginBottom: 10, marginLeft: 60 }}
        />
      )}

      <Text style={styles.label}>End Time - Required</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.buttonText}>{endDate.toLocaleString()}</Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="datetime"
          display="default"
          onChange={onChangeEndDate}
          minimumDate={startDate} // Prevents selecting an end date before the start date
          style={{ marginTop: 10, marginLeft: 60 }}
        />
      )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={{ ...styles.buttonText, color: "white" }}>Create Bet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("../screens/bets/BetCreationSuccessScreen")}>
          <Text style={{ ...styles.buttonText, color: "white" }}>go to success screen</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: bg
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 2,
    color: g8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  picker: {
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
  },
  datePicker: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: g8,
    fontSize: 16,
  },
});

import { View, Text, FlatList, TextInput, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { g7 } from "@/app/assets/color";
import { Ionicons } from "@expo/vector-icons"; // For the back button icon
import { fetchUsersByID } from "@/app/firebaseServices";
import { DefaultGroupPic } from "@/app/assets/images";

export default function BetDetailScreen() {
  const { bet } = useLocalSearchParams();
  const parsedBet = bet ? JSON.parse(bet) : null; // Parse bet data
  const router = useRouter();
  const navigation = useNavigation();

  const [messages, setMessages] = useState(parsedBet?.messages || []);
  const [newMessage, setNewMessage] = useState("");
  
 
  useEffect(() => {
    if (parsedBet) {
      navigation.setOptions({
        headerShown: true,
        headerTitle: parsedBet.betName, // Set title dynamically
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, parsedBet]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length, text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  if (!parsedBet) {
    return <Text>Invalid bet data</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      
      {/* Time Remaining Card */}
      <View style={{ backgroundColor: g7, padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <Text style={{ color: "white", fontSize: 16 }}>Time Remaining: {parsedBet.timeRemaining}</Text>
      </View>

      {/* Participants List */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Participants:</Text>
      <FlatList
        data={parsedBet.participants}
        keyExtractor={(item) => item.uid.toString()}
        renderItem={({ item }) => (
          <View 
            style={{
              flexDirection: "row", 
              alignItems: "center", 
              padding: 12, 
              backgroundColor: "#f3f3f3", 
              borderRadius: 8, 
              marginBottom: 8
            }}
          >
            {/* Profile Picture */}
            <Image 
              source={{ uri: DefaultGroupPic }} // Ensure item.profilePic contains a valid image URL
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
            />

            {/* Name */}
            <Text style={{ fontSize: 16, flex: 1 }}>
              {item.bettorDisplayName}
            </Text>

            {/* Bet Amount (aligned right) */}
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#555" }}>
              ${item.betAmount}
            </Text>
          </View>
        )}
      />

      

      {/* Chat Section */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Chat:</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: "#e0e0e0", borderRadius: 8, marginBottom: 8 }}>
            <Text><Text style={{ fontWeight: "bold" }}>{item.sender}:</Text> {item.text}</Text>
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Chat Input */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, marginBottom:24 }}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginRight: 10,
          }}
        />
        <TouchableOpacity onPress={handleSendMessage} style={{ backgroundColor: g7, padding: 10, borderRadius: 8 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

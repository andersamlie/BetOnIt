import { View, Text, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { g7 } from "@/app/assets/color";
import { Ionicons } from "@expo/vector-icons"; // For the back button icon
import { fetchUsersByID } from "@/app/firebaseServices";
import { DefaultGroupPic } from "@/app/assets/images";

export default function BetChatScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    const bet = params?.bet ? JSON.parse(params.bet) : null;

    console.log("parsedBet:", bet);

    const [messages, setMessages] = useState(bet?.messages || []);
    const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (bet) {
      navigation.setOptions({
        headerShown: true,
        headerTitle: bet.betName, // Set title dynamically
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, bet]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length, text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  if (!bet) {
    return <Text>Invalid bet data</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white", padding: 16 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // adjust based on your header/tab height
    >
      
      {/* Time Remaining Card */}
     
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

    </KeyboardAvoidingView>
  );
}

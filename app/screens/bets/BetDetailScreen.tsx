import { View, Text, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { g2, g4, g7, g8 } from "@/app/assets/color";
import { Ionicons } from "@expo/vector-icons"; // For the back button icon
import { fetchUsersByID } from "@/app/firebaseServices";
import { DefaultGroupPic } from "@/app/assets/images";
import { useContext } from 'react';
import { AuthContext } from '../../../authContext';
import { db } from "../../../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function BetDetailScreen() {
  const ver1 = false;
  
  const { bet } = useLocalSearchParams();
  const parsedBet = bet ? JSON.parse(bet) : null; // Parse bet data
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState(parsedBet?.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [yourBet, setYourBet] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [hasUserBet, setHasUserBet] = useState(false);

  const userContext = useContext(AuthContext);
  const user = userContext?.user as User | undefined;

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

  useEffect(() => {
    if (user && parsedBet?.participants) {
      const userHasBet = parsedBet.participants.some(p => p.userID === user.uid);
      setHasUserBet(userHasBet);
    }
  }, [user, parsedBet]);


  const getBetButtonStyle = (option) => {
    return option === yourBet ? styles.yourBet : styles.notYourBet;
  }

  const handleAmountChange = (text) => {
    const sanitized = text.replace(/[^0-9.]/g, '');
  
    const decimalCount = (sanitized.match(/\./g) || []).length;
    if (decimalCount > 1) return;
  
    const match = sanitized.match(/^(\d*)(\.?)(\d{0,2})$/);
    if (!match) return;
  
    const [_, intPart, dot, decimalPart] = match;
  
    if (intPart.length > 1 && intPart.startsWith('0')) return;
  
    const validText = `${intPart}${dot}${decimalPart}`;
    setBetAmount(validText);
  };
  

 const handleSendMessage = () => {
   if (newMessage.trim()) {
     setMessages([...messages, { id: messages.length, text: newMessage, sender: "You" }]);
     setNewMessage("");
   }
 };


 if (!parsedBet) {
   return <Text>Invalid bet data</Text>;
 }


 const getTimeRemaining = (endDate) => {
    if (!endDate || !endDate.seconds) return "N/A";
    const end = new Date(endDate.seconds * 1000);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
 };

 console.log("USERR: ", user)

 const submitBet = async ({ betID, amount, outcome, userID }) => {
    const userRef = doc(db, "users", userID);

    const betData = {
      betID,
      amount,
      outcome,
      timestamp: new Date().toISOString(), // optional
    };
    console.log("betData:", betData);
    console.log("REACHED");
    try {
      await updateDoc(userRef, {
        bets: arrayUnion(betData),
      });
      console.log("Bet successfully added to user!");
    } catch (error) {
      console.error("Error updating user bets:", error);
    }
 }

 const updateBetWithParticipant = async ({ betID, userID, amount, outcome }) => {
  const betRef = doc(db, "bets", betID);

  const participantData = {
    userID,
    amount,
    outcome,
    displayName: `${user.firstName} ${user.lastName}`
  }

  try {
    await updateDoc(betRef, {
      participants: arrayUnion(participantData),
    });
    console.log("Participant added to bet!");
  } catch (error) {
    console.error("Error updating bet participants:", error);
  }
};

 console.log("i[");

 return (
   <KeyboardAvoidingView
     behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={{ flex: 1, backgroundColor: "white", padding: 16 }}
     keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // adjust based on your header/tab height
   >
    
     {/* Time Remaining Card */}
     <View style={{ backgroundColor: g7, padding: 16, borderRadius: 12, marginBottom: 16 }}>
       <Text style={{ color: "white", fontSize: 16 }}> Time Remaining: {getTimeRemaining(parsedBet.endDate)}</Text>
     </View>


     {/* Participants List */}
     <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Participants:</Text>
     <View style={{ height: 180, marginBottom: 8 }}>
     {parsedBet.participants ? (
     <FlatList
       data={parsedBet.participants}
       keyExtractor={(item) => item.userID.toString()}
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
             {item.displayName}
           </Text>


           {/* Bet Amount (aligned right) */}
           <Text style={{ fontSize: 16, fontWeight: "bold", color: "#555" }}>
             ${item.amount} on {item.outcome}
           </Text>
         </View>
       )}
     /> ) : (
       <Text>No Participants Yet :(</Text>
     )}
     </View>


    
     {hasUserBet ? (
     <View style={{flex: 1}}>
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
     />
     {/* Chat Input */}
     <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, marginBottom: 48 }}>
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
     ) : (
       // MAKE BET!!!
       <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Make a Bet:</Text>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", maxHeight: 50}}>
            <TouchableOpacity style={getBetButtonStyle(parsedBet.betOutcomes[0])} onPress={() => setYourBet(parsedBet.betOutcomes[0])}>
              <Text style={{ color: "white", fontSize: 16, alignSelf: "center", }}> {parsedBet.betOutcomes[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={getBetButtonStyle(parsedBet.betOutcomes[1])} onPress={() => setYourBet(parsedBet.betOutcomes[1])}>
              <Text style={{ color: "white", fontSize: 16, alignSelf: "center" }}> {parsedBet.betOutcomes[1]}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter bet amount"
              value={betAmount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
            />
          </View>
          {betAmount && yourBet && (parseFloat(betAmount) > 0) && (
            <TouchableOpacity
              onPress={async () => {
                // Replace this with your actual bet submission logic
                const betData = {
                  betID: parsedBet.id,
                  amount: parseFloat(betAmount),
                  outcome: yourBet,
                  userID: user.uid,
                };
              
                // Validate inputs first
                if (!betData.betID || betData.amount == null || !betData.outcome || !betData.userID) {
                  console.error("Invalid bet data:", betData);
                  return;
                }
              
                // 1. Update user
                await submitBet(betData);
              
                // 2. Update bet
                await updateBetWithParticipant(betData);
              
                // 3. Navigate or reload
                navigation.goBack();
              }}

              style={{
                backgroundColor: "green",
                paddingVertical: 10,
                borderRadius: 8,
                marginTop: 4,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Place ${betAmount} Bet</Text>
            </TouchableOpacity>
          )

          }

        </>
      
       /**<TouchableOpacity
         style={styles.button}
         onPress={() => router.push({
           pathname: "./BetChatScreen",
           params: { bet: JSON.stringify(parsedBet) } // Convert to string for safe passing
         })
       }>
         <Text style={{ ...styles.buttonText, color: "white" }}>Go to Bet Chat</Text>
       </TouchableOpacity> **/
     )
     }


   </KeyboardAvoidingView>
 );
}


const styles = StyleSheet.create({
 button: {
   backgroundColor: "#007bff",
   padding: 15,
   borderRadius: 5,
   alignItems: "center",
   marginTop: 20,
   marginBottom: 48
 },
 buttonText: {
   color: g8,
   fontSize: 16,
 },
 yourBet: {
   backgroundColor: "green",
   width: '48%',
   height: 40,
   borderRadius: 12,
   justifyContent: "center"
 },
 notYourBet: {
   backgroundColor: g4,
   width: '48%',
   height: 40,
   borderRadius: 12,
   justifyContent: "center"
 },
 input: {
  borderWidth: 1,
  borderColor: "black",
  padding: 10,
  borderRadius: 5,
  marginBottom: 10,
  width: '93%'
},
amountInputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
},

dollarSign: {
  fontWeight: 'bold',
  fontSize: 32,
  marginRight: 4,
  marginBottom: 8
},
});
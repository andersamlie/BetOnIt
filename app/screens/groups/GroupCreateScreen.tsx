import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import { fetchUsersByID, createGroup, updateGroupMembership } from "../../firebaseServices";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../../../authContext";
import { DefaultGroupPic, DefaultProfilePic } from '../../assets/images';

export default function GroupCreateScreen() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState(new Set());
  const [groupName, setGroupName] = useState("");
  const [groupPic, setGroupPic] = useState<string | null>(null);
  const router = useRouter();
  const userContext = useContext(AuthContext);
  const navigation = useNavigation();
  const user = userContext?.user as User | undefined;

    if (!user) {
    return <Text>Loading...</Text>; // or navigate away, show a placeholder, etc.
    }

    type User = {
        uid: string;
        friends: string[];
    }

  type Friend = {
    id: string;
    age: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    friends: string[];
    groupIDs: string[];
    profilePic: string;
    winRate: number;
    betIDs: string[];
    rating: number;
}
 
  useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTitle: "Create a Group",
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    
  }, [navigation]);

  useEffect(() => {
    const loadFriends = async () => {
      if (user?.friends) {
        const foundFriends = await fetchUsersByID(user.friends);
        setFriends(foundFriends);
      }
    };
    loadFriends();
  }, [user]);

  // Toggle friend selection
  const toggleSelection = (id: string) => {
    setSelectedFriends((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // Pick an image for the group
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupPic(result.assets[0].uri);
    }
  };

  // Confirm button action
  const handleConfirm = async () => {
    const selectedFriendList = friends.filter((f) => selectedFriends.has(f.id));
    console.log("Group Name:", groupName);
    console.log("Group Photo:", groupPic);
    console.log("Selected Friends:", selectedFriendList);
    const memberIDs = selectedFriendList.map(friend => friend.id).concat(user.uid);
    console.log("members:", memberIDs);
    const betIDs: string[] = []; 
    console.log("members:", betIDs);
    
    if (groupName === "" || selectedFriendList.length === 0) {
        Alert.alert(
            "Incomplete Information",
            "Some required information is missing. Please complete all fields before submitting.",
            [
                { text: "Cancel", style: "cancel" },
            ]
            );
        return;
    }
    
    const groupData = {
        groupName,
        groupPic: groupPic ?? null,
        memberIDs,
        betIDs
    };

    console.log("gd: ", groupData)
    
    const gID = await createGroup(groupData);

    updateGroupMembership(memberIDs, gID);

    router.push("./GroupCreationSuccessScreen");
    
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Group Photo Picker */}
      <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginBottom: 15 }}>
        <Image
          source={groupPic ? { uri: groupPic } : DefaultGroupPic}
          style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#ddd" }}
        />
        <Text style={{ marginTop: 8, color: "#007BFF" }}>{groupPic ? `Change Group Photo` : `Add Group Photo`}</Text>
      </TouchableOpacity>

      {/* Group Name Input */}
      <TextInput
        placeholder="Enter group name..."
        value={groupName}
        onChangeText={setGroupName}
        style={{
          fontSize: 18,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          marginBottom: 15,
        }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Select Friends
      </Text>

      {/* Friend List */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        style={{ maxHeight: "50%" }}
        renderItem={({ item }) => {
          const isSelected = selectedFriends.has(item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleSelection(item.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                backgroundColor: isSelected ? "#d1e7ff" : "#f3f3f3",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Image
                source={DefaultProfilePic}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
              />
              <Text style={{ fontSize: 16, flex: 1 }}>
                {item.firstName} {item.lastName}
              </Text>

              {isSelected && (
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#007BFF" }}>
                  ✓
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Confirm Button */}
      <TouchableOpacity
        onPress={handleConfirm}
        style={{
          marginTop: 20,
          backgroundColor: groupName && selectedFriends.size > 0 ? "#007BFF" : "#ccc",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
        disabled={!groupName || selectedFriends.size === 0}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

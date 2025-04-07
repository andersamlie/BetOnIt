import { Text, View, StyleSheet, ScrollView, Button, Image, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../assets/color';
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultGroupPic } from '../assets/images';
import GroupCard from '../components/groups/GroupCard';
import { fetchGroupsByID } from "../firebaseServices";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authContext';

export default function GroupsScreen() {
  type Group = {
    id: string;
    groupPic: string;
    groupName: string;
    memberIDs: string[];
    betIDs: string[];
  };

  type User = {
    id: string;
    groupIDs: string[];
  };

  const router = useRouter();
  const userContext = useContext(AuthContext);
  const user = userContext?.user as User | undefined;
  
  if (!user) {
    return <Text>Loading...</Text>; // or navigate away, show a placeholder, etc.
  }
  const [groups, setGroups] = useState<Group[]>([]);


  
  
  useEffect(() => {
    if (!user?.groupIDs || user.groupIDs.length === 0) return; // ✅ Ensure groupIDs exist before fetching
  
    const loadGroups = async () => {
      try {
        const data = await fetchGroupsByID(user.groupIDs);
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
  
    loadGroups();
  }, [user?.groupIDs]); // ✅ Only re-run when groupIDs change
  

  console.log("grps: ", groups)

  return (
    <View style={styles.container}>
      {/* Title and Subtitle */}
      <Text style={styles.title}>Your Groups</Text>
      <Text style={styles.subtitle}>Manage and view your betting circles</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("../screens/groups/GroupCreateScreen")}>
          <Text style={styles.buttonText}>Create New Group</Text>
          <Ionicons name="add" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Scrollable List of Groups */}
      <ScrollView style={styles.scrollView}>
      {groups.map((group) => (
          <GroupCard
            key={group.id}
            groupImage={group.groupPic}
            groupName={group.groupName}
            membersCount={group.memberIDs.length}
            activeBetsCount={group.betIDs.length}
            onChatPress={() => null}
          />
      ))}
        {/* Add more group cards here */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: black,
    marginBottom: 4,
  },
  button: {
    width: '100%',
    backgroundColor: bg,
    padding: 8,
    borderWidth: 2,
    borderColor: g3,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row'
  },
  subtitle: {
    fontSize: 16,
    color: g6,
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: bg,
    borderWidth: 2,
    borderColor: g3,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: black,
  },
  groupInfo: {
    fontSize: 14,
    color: '#777',
  },
  chatButton: {
    backgroundColor: g5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: black,
    fontWeight: 'bold',
  },
  chatButtonText: {
    color: bg,
    fontWeight: 'bold',
  },
});

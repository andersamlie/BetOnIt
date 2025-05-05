import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../assets/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultProfilePic } from '../assets/images'
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../authContext';
import { logOut } from '../../authService';
import { Timestamp } from 'firebase/firestore';

export default function ProfileScreen() {
 
    type User = {
        age: string,
        createdAt: Timestamp;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        friends: string[];
        groupIDs: string[];
        profilePic: string;
        winRate: number;
        bets: [Object];
        rating: number;
    }
  const router = useRouter();
  const userContext = useContext(AuthContext);
  const user = userContext?.user as User | undefined;

  if (!user) {
    return <Text>Loading...</Text>; // or navigate away, show a placeholder, etc.
  }
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={DefaultProfilePic} style={styles.pfp} />
        <View style={{ flexDirection: 'column', gap: 4 }}>
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.subtitle}>@{user.username}</Text>
            <Text style={styles.subtitle}>Member since 2025</Text>
        </View>
      </View>

      {/* Row of 3 Blocks */}
      <View style={styles.blocksRow}>
        <View style={styles.block}>
            <Text style={styles.name}>{user.friends ? user.friends.length : 0}</Text>
            <Text style={styles.subtitle}>Friends</Text>
        </View>
        <View style={styles.block}>
            <Text style={styles.name}>{user.winRate ? user.winRate * 100 : `68`}%</Text>
            <Text style={styles.subtitle}>Win Rate</Text>
        </View>
      </View>
      <View style={styles.blocksRow}>
        <View style={styles.block}>
            <Text style={styles.name}>{user.bets ? user.bets.length : 0}</Text>
            <Text style={styles.subtitle}>Total Bets</Text>
        </View>
        <View style={styles.block}>
            <Text style={styles.name}>{user.rating ? user.rating : `9.2`} / 10 </Text>
            <Text style={styles.subtitle}>Reported Rating</Text>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Deposit Money</Text>
          <Ionicons name="card-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Betting History</Text>
          <Ionicons name="time-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
          <Ionicons name="cog-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
            logOut();
            router.replace("../../screens/auth/LoginScreen")}
        }>
          <Text style={styles.signOutText}>Sign Out</Text>
          <Ionicons name="exit-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg,
    paddingTop: 16,
    paddingHorizontal: 16
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pfp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: black,
  },
  subtitle: {
    fontSize: 14,
    color: g6,
  },
  blocksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  block: {
    width: 170,
    height: 80,
    backgroundColor: bg,
    borderColor: g3,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: bg,
    padding: 15,
    borderWidth: 2,
    borderColor: g3,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row'
  },
  buttonText: {
    color: black,
    fontSize: 16,
    fontWeight: '500',
  },
  signOutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
});

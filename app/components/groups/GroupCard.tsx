import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../../assets/color';
import { DefaultGroupPic } from '../../assets/images';

// Define types for the props that the GroupCard component will receive
interface GroupCardProps {
  groupImage: any;
  groupName: string;
  membersCount: number;
  activeBetsCount: number;
  onChatPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ groupImage, groupName, membersCount, activeBetsCount, onChatPress }) => {
  return (
    <View style={styles.card}>
      <Image source={DefaultGroupPic} style={styles.groupImage} />
      <View style={styles.cardContent}>
        <Text style={styles.groupName}>{groupName}</Text>
        <Text style={styles.groupInfo}>Members: {membersCount} | Active Bets: {activeBetsCount}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
        <Text style={styles.chatButtonText}>Open</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: g3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121', // Customize this as needed
  },
  groupInfo: {
    fontSize: 14,
    color: '#777',
  },
  chatButton: {
    backgroundColor: '#007BFF', // Customize the button color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GroupCard;

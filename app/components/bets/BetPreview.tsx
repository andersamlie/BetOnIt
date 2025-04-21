import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../../assets/color';
import BetAmountTile from './BetAmountTile';
import BetOddsTile from './BetOddsTile';
import BetWinningsTile from './BetWinningsTile';
import { DefaultProfilePic } from '@/app/assets/images';

// Define types for the props that the BetCard component will receive
interface BetPreviewProps {
  betTitle: string;
  betSubtitle: string;
  betOutcomes: Array<string>;
  betStatus: string;
  verificationType: string;
  betPhoto: string;
  numParticipants: number;
  onPress: () => void;
}

const getStatusColor = (status: string) => {
    if (status === "Active") {
        return "green";
    } else if (status === "Pending") {
        return "orange"
    } else {
        return g6
    }
}

const BetPreview: React.FC<BetPreviewProps> = ({ betTitle, betSubtitle, betStatus, betOutcomes, verificationType, betPhoto, numParticipants, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.topRow}>
            <Image style={styles.betPic} source={{uri: betPhoto}}></Image>
            <View style={styles.textLines}>
                <Text style={styles.betTitle}>{betTitle}</Text>
                <Text style={styles.betSubtitle}>{betSubtitle}</Text>
            </View>
            <TouchableOpacity style={{...styles.statusButton, backgroundColor: getStatusColor(betStatus)}}>
                <Text style={styles.statusButtonText}>{betStatus}</Text>
            </TouchableOpacity>
        </View>
        {betOutcomes && 
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.betDetail}>
                    <Text style={{ ...styles.betTitle, fontWeight: "600" }}>{betOutcomes[0]}</Text>
                </View>
                <View style={styles.betDetail}>
                    <Text style={{ ...styles.betTitle, fontWeight: "600" }}>{betOutcomes[1]}</Text>
                </View>
            </View>
        }

        <View style={{ marginTop: 4 }}>
            <Text style={{ ...styles.betSubtitle }}>{numParticipants || 0} Active Bettors</Text>
        </View>

        <View style={{ marginTop: 4 }}>
            <Text style={{ ...styles.betSubtitle, fontStyle: 'italic' }}>Verification Type: {verificationType} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  statusButton: {
    position: 'absolute',
    top: 8,
    right: 4,
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  betPic: {
    height: 45,
    width: 45,
    borderRadius: 100
  },
  betDetail: {
    marginTop: 12,
    borderRadius: 12,
    padding: 6,
    backgroundColor: g2,
    width: "48%",
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  betTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  betSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  betInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textLines: {
    marginLeft: 10,
    flexDirection: 'column',
    maxWidth: 200
  }
});

export default BetPreview;

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../../assets/color';

// Define types for the props that the BetCard component will receive
interface BetWinningsTileProps {
  betWinnings: number;
}

const BetWinningsTile: React.FC<BetWinningsTileProps> = ({ betWinnings }) => {
  return (
    <View style={styles.card}>
        <Text>To Win:</Text>
        <Text style={{ fontWeight: "bold", color: "green" }}>${betWinnings > 0 ? betWinnings.toFixed(2) : betWinnings}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
    alignItems: 'flex-end',
    marginLeft: 64
  },
});

export default BetWinningsTile;
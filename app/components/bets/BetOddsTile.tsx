import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../../assets/color';

// Define types for the props that the BetCard component will receive
interface BetOddsTileProps {
  betOdds: number;
}

const BetOddsTile: React.FC<BetOddsTileProps> = ({ betOdds }) => {
  const getColor = (betOdds: number) => {
    return (!betOdds ? g6 : (betOdds > 0 ? "green" : "red"))
  }
  return (
    <View style={styles.card}>
        <Text>Odds:</Text>
        <Text style={{ color: getColor(betOdds), fontWeight: "bold" }}>{!betOdds && "TBD"}{betOdds > 0 ? "+" : ""}{betOdds}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
    alignItems: 'center',
    marginLeft: 50
  },
});

export default BetOddsTile;
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../../assets/color';

// Define types for the props that the BetCard component will receive
interface BetAmountTileProps {
  betAmount: number;
}

const BetAmountTile: React.FC<BetAmountTileProps> = ({ betAmount }) => {
return (
    <View style={styles.card}>
        <Text>Bet Amount:</Text>
        <Text style={{ fontWeight: "bold" }}>${betAmount.toFixed(2)}</Text>
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
    alignItems: 'flex-start',
    },
});

export default BetAmountTile;
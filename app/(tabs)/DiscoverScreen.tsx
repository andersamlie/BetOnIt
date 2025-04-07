import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BetCard from '../components/bets/BetCard';
import { LinearGradient } from 'expo-linear-gradient'; // Expo's version of LinearGradient
import { fetchBets } from '../firebaseServices';
import { useState, useEffect} from 'react';

import { bg } from '../assets/color';

export default function DiscoverScreen() {

    type Bet = {
        id: string;
        betDescription: string;
        betName: string;
        betOdds: number;
        betStatus: string;
        ownerId: string;
        verificationType: string;
        betPhoto: string
    }

    const [bets, setBets] = useState<Bet[]>([]);

    useEffect(() => {
        const loadBets = async () => {
            const data = await fetchBets();
            setBets(data);
        };
        loadBets();
    }, []);

    const determineWinnings = (stake: number, odds: number) => {
        if (odds < 0) {
          return stake + ((100/-odds) * stake);
        } else {
          return stake + ((odds/100) * stake);
        }
      }

  return (
    <View style={styles.container}>
      {/* Title & Subtitle */}
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Explore trending and active bets</Text>

      {/* Horizontal Tiles */}
      <View style={styles.tilesContainer}>
        <LinearGradient colors={['#203cff', '#d711ea']} style={styles.tile}>
          <Text style={styles.tileText}>🔥 Trending Now</Text>
        </LinearGradient>
        <LinearGradient colors={['#FF4500', '#ffa220']} style={styles.tile}>
          <Text style={styles.tileText}>⚡ Most Active</Text>
        </LinearGradient>
      </View>

      {/* Scrollable Bet Cards */}
      <ScrollView style={styles.scrollView}>
        {bets.map((bet) => (
            <BetCard
                key={bet.id}  // Ensure unique key for each BetCard
                betTitle={bet.betName}
                betSubtitle={bet.betDescription}
                betStatus={"Active"}  // You can replace this with dynamic status
                betAmount={18}  // Set your bet amount dynamically
                betOdds={bet.betOdds}  // Set your bet odds dynamically
                betWinnings={determineWinnings(18, bet.betOdds)}  // Calculate winnings
                verificationType={bet.verificationType}
                betPhoto={bet.betPhoto}
                onPress={() => null} // Add your handler for chat press
            />
        ))}
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
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    height: 48
  },
  tileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
});


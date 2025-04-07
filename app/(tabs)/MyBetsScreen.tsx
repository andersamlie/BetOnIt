import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { bg, g1, g2, g3, g4, g5, g6, g7, g8, g9, black } from '../assets/color';
import BetCard from '../components/bets/BetCard';
import { fetchBets } from "../firebaseServices";
import { useState, useEffect } from 'react';
import { useRouter } from "expo-router";

export default function MyBetsScreen() {

  type Bet = {
    id: string;
    betDescription: string;
    betName: string;
    betOdds: number;
    betStatus: string;
    ownerId: string;
    verificationType: string;
    startTime: Date;
    endTime: Date;
    betPhoto: string
  }
  const [bets, setBets] = useState<Bet[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadBets = async () => {
      const data = await fetchBets();
      setBets(data);
    };
    loadBets();
  }, []);

  const getBetStatus = (start: Date, end: Date) => {
    const now = new Date;
    if (now < end) {
      return "Active"
    } else {
      return "Settled"
    }
  }

  const determineWinnings = (stake: number, odds: number) => {
    if (odds < 0) {
      return stake + ((100/-odds) * stake);
    } else {
      return stake + ((odds/100) * stake);
    }
  }
  return (
    <View style={styles.container}>
      {/* Title and Subtitle */}
      <Text style={styles.title}>My Active Bets</Text>
      <Text style={styles.subtitle}>Track your active bets</Text>
      
      {/* Scrollable List of Groups */}
      <ScrollView style={styles.scrollView}>
        {bets.map((bet) => (
          <BetCard
            key={bet.id}
            betTitle={bet.betName}
            betPhoto={bet.betPhoto}
            betSubtitle={bet.betDescription}
            betStatus={getBetStatus(bet.startTime, bet.endTime)}
            betAmount={18}
            betOdds={bet.betOdds}
            betWinnings={determineWinnings(18, bet.betOdds)}
            verificationType={bet.verificationType}
            onPress={() => router.push({ 
                pathname: "../screens/bets/BetDetailScreen",
                params: { bet: JSON.stringify(bet) } // Convert to string for safe passing
            })}
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
  betTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: black,
  },
  betSubtitle: {
    fontSize: 12,
    color: g6,
  },
  betInfo: {
    flexDirection: 'row'
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
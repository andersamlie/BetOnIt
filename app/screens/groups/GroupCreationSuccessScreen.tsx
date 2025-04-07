import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { g7 } from "@/app/assets/color";
import { useNavigation } from "@react-navigation/native";

export default function BetCreateScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Group Created Successfully!</Text>
      <TouchableOpacity onPress={() => router.push("/")} style={{ padding: 10, backgroundColor: g7, borderRadius: 12 }}>
        <Text style={{ color: "white", fontSize: 16 }}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

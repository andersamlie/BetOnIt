import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { bg, g1 } from '../assets/color';
import { TouchableOpacity, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
      tabBarActiveTintColor: '#000000',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: bg,
        height: 120,
        borderBottomWidth: 2,
        borderBottomColor: "#E0E0E0"
      },
      tabBarStyle: {
      backgroundColor: bg,
      },
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ marginLeft: 15, fontSize: 28, fontWeight: 'bold' }}>
            BetOnIt
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-outline" size={28} color="black" />
            <View style={{borderWidth: 1.25, borderRadius: 4, padding: 4, marginLeft: 8, borderColor: "#BDBDBD"}}>
              <Text> $100 </Text>
            </View>
        </TouchableOpacity>
      ),
    }}
    >
      <Tabs.Screen name="MyBetsScreen" options={{
          title: "My Bets",
          tabBarIcon: ({ color }) => (
            <Ionicons name={'cash'} color={color} size={24} />
          ), 
        }} 
      />
      <Tabs.Screen name="GroupsScreen" options={{
          title: "Groups",
          tabBarIcon: ({ color }) => (
            <Ionicons name={'people'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen name="CreateScreen" options={{
          title: "Create Bet",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen name="DiscoverScreen" options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <Ionicons name={'rocket'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen name="ProfileScreen" options={{
          title: "My Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name={'person'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}

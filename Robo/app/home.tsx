
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// // Mock function to simulate live tracking (replace with actual API calls)
// const getRobotStatus = () => {
//   return {
//     battery: Math.floor(Math.random() * 100),  // Random battery %
//     status: Math.random() > 0.5 ? 'Cleaning' : 'Idle',
//     obstacles: Math.random() > 0.7,  // Random obstacle detection
//   };
// };
// const buttons = [
//   { title: "Live Tracking", screen: "LiveTracking", icon: "map-marker", color: "#FF5733" },
//   { title: "Battery", screen: "Battery", icon: "battery", color: "#3498DB" },
//   { title: "Manual Control", screen: "ManualControl", icon: "gamepad-variant", color: "#2ECC71" },
//   { title: "Obstacle Logs", screen: "ObstacleLogs", icon: "alert-circle", color: "#F39C12" },
//   { title: "Settings", screen: "Settings", icon: "cog", color: "#9B59B6" },
// ];


// export default function HomeScreen() {
//   const [robotStatus, setRobotStatus] = useState(getRobotStatus());
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRobotStatus(getRobotStatus());
//       setLoading(false);
//     }, 3000); // Update every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Image source={require('@/assets/images/robot-logo.png')} style={styles.logo} />
//         <Text style={styles.title}>Firmware Forge 🚀</Text>

//         {/* Status Display */}
//         <View style={styles.statusCard}>
//           <Text style={styles.statusText}>Status: {robotStatus.status}</Text>
//           <Text style={styles.statusText}>Battery: {robotStatus.battery}%</Text>
//           {robotStatus.obstacles && <Text style={styles.alertText}>⚠ Obstacle Detected!</Text>}
//         </View>

//         <View style={styles.buttonContainer}>
//           {buttons.map((btn, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.button, { backgroundColor: btn.color }]}
//               onPress={() => navigation.navigate(btn.screen)}
//             >
//               <MaterialCommunityIcons name={btn.icon} size={40} color="#FFF" />
//               <Text style={styles.buttonText}>{btn.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//     textAlign: 'center',
//   },
//   statusCard: {
//     backgroundColor: '#F5F5F5',
//     padding: 15,
//     borderRadius: 10,
//     width: '90%',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   statusText: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   alertText: {
//     fontSize: 16,
//     color: 'red',
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center', 
//     width: '100%',
//     gap: 15, // Adds space between buttons (only works in newer React Native versions)
//   },
  
//   button: {
//     width: 120,
//     height: 120,
//     borderRadius: 15,
//     marginVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
//   logo: {
//     height: 100,
//     width: 100,
//     marginBottom: 20,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock function to simulate live tracking (replace with actual API calls)
const getRobotStatus = () => {
  return {
    battery: Math.floor(Math.random() * 100),  // Random battery %
    status: Math.random() > 0.5 ? 'Cleaning' : 'Idle',
    obstacles: Math.random() > 0.7,  // Random obstacle detection
  };
};

export default function HomeScreen() {
  const [robotStatus, setRobotStatus] = useState(getRobotStatus());
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotStatus(getRobotStatus());
      setLoading(false);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const buttons = [
    { title: 'Live Tracking', icon: 'map-marker-path', color: '#4DB6AC', screen: 'Tracking' },
    { title: 'Battery Status', icon: 'battery-charging', color: '#FFD54F', screen: 'Battery' },
    { title: 'Manual Control', icon: 'remote', color: '#7986CB', screen: 'ManualControl' },
    { title: 'Obstacle Logs', icon: 'alert-circle', color: '#E57373', screen: 'ObstacleLogs' },
    { title: 'Settings', icon: 'cog', color: '#81C784', screen: 'Settings' },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/robot-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Firmware Forge 🚀</Text>

        {/* Status Display */}
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Status: {robotStatus.status}</Text>
          <Text style={styles.statusText}>Battery: {robotStatus.battery}%</Text>
          {robotStatus.obstacles && <Text style={styles.alertText}>⚠ Obstacle Detected!</Text>}
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: btn.color }]}
              onPress={() => navigation.navigate(btn.screen)}
            >
              <MaterialCommunityIcons name={btn.icon} size={40} color="#FFF" />
              <Text style={styles.buttonText}>{btn.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  alertText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 20,
  },
});
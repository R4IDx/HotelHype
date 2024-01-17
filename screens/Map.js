import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';


const MapScreen = () => {
    const navigation = useNavigation();
    const navigateToMainMenu = () => {
        navigation.navigate('MainMenu');
    };

    return (
        <View style={styles.container}>
          <View style={styles.topMenu}>
            <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
              <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>
                Main Menu
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: 'white' }}>Karte</Text>
          </View>
    
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Add markers or other map elements as needed */}
            <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} title="Marker Title" />
          </MapView>
        </View>
      );
    };
    
export default MapScreen;

const styles = StyleSheet.create({
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'blue',
    height: 70,
  },
  menuButton: {
    padding: 10,
  },
  map: {
    flex: 1,
  },
});


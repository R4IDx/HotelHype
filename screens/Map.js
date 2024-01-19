import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const MapScreen = () => {
  const navigation = useNavigation();
  const navigateToMainMenu = () => {
    navigation.navigate('MainMenu');
  };

  return (
      <View style={styles.container}>
        <StatusBar backgroundColor='white' barStyle="light-content"/>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../logo/Logo1.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        <View style={styles.topMenu}>
          <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
            <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>
              Main Menu
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, color: 'white' }}>Karte</Text>
        </View>
  
        <View style={styles.contentContainer}>
          <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 48.48193961482204,
              longitude: 9.186655378395663,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Marker setzen */}
            <Marker
              coordinate={{ latitude: 48.48193961482204, longitude: 9.186655378395663 }}
              title="Reutlingen University"
              description="University"
            />
          </MapView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
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
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'green', // Hier die gewünschte Hintergrundfarbe für den MainMenu-Container
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
    marginTop: 0, // Hier kannst du den oberen Abstand anpassen
  },
  logo: {
    width: 120, // Breite des Logos (anpassen nach Bedarf)
    height: 100, // Höhe des Logos (anpassen nach Bedarf)
  },
  mapContainer: {
    flex: 2, // Ändere dies nach Bedarf, um das Verhältnis zwischen MainMenu und Kartencontainer zu steuern
  },
  map: {
    flex: 1,
  },
});
export default MapScreen;

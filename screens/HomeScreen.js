import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as Location from 'expo-location';

const HotelHomeScreen = () => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore.collection('hotels').onSnapshot((snapshot) => {
      const hotelsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        // Hier den Städtenamen abrufen
        const cityName = await getCityName(currentLocation.coords.latitude, currentLocation.coords.longitude);
        setCity(cityName);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocationAsync();
  }, []);


  const getCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
  
      console.log('API-Antwort:', data);
  
      let cityName;
  
      if (data && data.address && (data.address.city || data.address.village)) {
        cityName = data.address.city || data.address.village;
      } else if (data && data.address && data.address.county) {
        // Extrahiere den Stadtnamen aus "Stadt Landkreis Reutlingen"
        const countyParts = data.address.county.split(' ');
        cityName = countyParts[countyParts.length - 1];
      } else {
        cityName = 'Unbekannt';
      }
  
      console.log(cityName);
      searchHotelsByCity(cityName);
    } catch (error) {
      console.error('Fehler beim Abrufen des Städtenamens:', error);
      return 'Unbekannt';
    }
  };


  const sendLocation = async () => {
    try {
      await getLocationAsync();
      if (location) {
        console.log('Standort übertragen:', location);
        const cityName = await getCityName(location.latitude, location.longitude);
         console.log('Städtenamen:', cityName);
      } else {
        console.warn('Standort nicht verfügbar');
      }
    } catch (error) {
      console.error('Fehler beim Übertragen des Standorts:', error);
    }
  };


  const searchHotelsByCity = async (cityName) => {
    console.log('Location:', cityName);
    try {
      const response = await axios.get('https://airbnb13.p.rapidapi.com/search-location', {
        params: {
          location: cityName,
          checkin: '2024-01-20',
          checkout: '2024-01-21',
          adults: '1',
          children: '0',
          infants: '0',
          pets: '0',
          page: '1',
          currency: 'USD',
        },
        headers: {
          'X-RapidAPI-Key': '9f6d09997bmshdbfa2e4e394ffb8p1c3f84jsn92a0930ce2d4',
          'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
        },
      });

      const hotelsData = response.data.results;
      setFilteredHotels(hotelsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    searchHotelsByCity(filter);
  };

  const handleMapPress = () => {
    navigation.navigate("Map");
  }; 
  const navigateToDetails = (hotel) => {
    navigation.navigate('HotelDetailsScreen', { hotel });
  };

  const navigateToMainMenu = () => {
    navigation.navigate('MainMenu');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../logo/Logo1.jpg')}
          style={styles.headerImage}
        />
      </View>
  
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
          <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>Main Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sendLocation} style={styles.menuButton}>
          <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>
            Show Hotels
          </Text>
        </TouchableOpacity>
      </View>
  
      <ScrollView style={styles.hotelList}>
        
        {filteredHotels.map((hotel) => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelContainer}
            onPress={() => navigateToDetails(hotel)}
          >
            <Image source={{ uri: hotel.images[0] }} style={styles.hotelImage} />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelDescription}>{hotel.type}</Text>
              <Text style={styles.hotelDescription}>City: {hotel.city}</Text>
              <Text style={styles.hotelAvgRating}>
                Rating: {hotel.rating ? hotel.rating.toFixed(1) : 'N/A'} ☆ ({hotel.reviewsCount || 0} reviews)
              </Text>
              <Text style={styles.hotelNumRatings}>Price: {hotel.price.total} {hotel.price.currency}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
  
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.reservationButton} onPress={handleMapPress}>
          <Icon name="map" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
        }  
export default HotelHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'blue',
    height: 70,
  },
  filterButton: {
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
    searchInput: {
      flex: 1,
      height: 40,
      color: 'black',
    },
    searchIcon: {
      marginRight: 10,
    },
    hotelList: {
      flex: 1,
      padding: 15,
    },
    hotelContainer: {
      flexDirection: 'row',
      alignItems: "center",
      marginBottom: 20,
      borderRadius: 10,
      padding: 10,
    },
    hotelImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    hotelInfo: {
      flex: 1,
      marginLeft: 10,
    },
    hotelName: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: 'blue', // Ändern Sie die Textfarbe entsprechend
    },
    hotelDescription: {
      marginBottom: 5,
      color: 'blue', // Ändern Sie die Textfarbe entsprechend
    },
    hotelAvgRating: {
      marginBottom: 5,
      color: 'blue', // Ändern Sie die Textfarbe entsprechend
    },
    hotelNumRatings: {
      color: 'blue', // Ändern Sie die Textfarbe entsprechend
    },
    searchResultsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: 'bold',
      color: 'blue', // Ändern Sie die Textfarbe entsprechend
    },
    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      backgroundColor: 'blue',
    },
    reservationButton: {
      padding: 10,
    },
  });

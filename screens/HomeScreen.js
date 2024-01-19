import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const HotelHomeScreen = () => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredHotels, setFilteredHotels] = useState([]);

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

  const searchHotelsByCity = async (cityName) => {
    try {
      const response = await axios.get(`https://api.makcorps.com/free/${cityName}`, {
        headers: {
          'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTc2NzczNjAsImlkZW50aXR5IjozLCJuYmYiOjE1MTc2NzczNjAsImV4cCI6MTUxNzY3OTE2MH0.ytSqQj3VDymEaJz9EIdskWELwDQZRD1Dbo6TuHaPz9U'
        },
      });

      const hotelsData = response.data.hotels;
      setFilteredHotels(hotelsData);  // Update filteredHotels instead of hotels
    } catch (error) {
      console.error("Error fetching data:", error);
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
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="white" style={styles.searchIcon} />
          <TextInput
            placeholder="Enter your Cityname"
            style={styles.searchInput}
            value={filter}
            onChangeText={(text) => setFilter(text)}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.hotelList}>
        {filteredHotels.map((hotel) => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelContainer}
            onPress={() => navigateToDetails(hotel)}
          >
            <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelDescription}>{hotel.description}</Text>
              <Text style={styles.hotelDescription}>City: {hotel.location}</Text>
              {hotel.averageRating && (
                <Text style={styles.hotelAvgRating}>
                  Rating: {hotel.averageRating.toFixed(1)} ☆
                </Text>
              )}
              <Text style={styles.hotelNumRatings}>{hotel.numRatings}</Text>
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
};

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
      backgroundColor: 'white', // Ändern Sie die Hintergrundfarbe entsprechend
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

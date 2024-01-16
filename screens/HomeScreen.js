import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HotelHomeScreen = () => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
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

  const navigateToFilterScreen = () => {
    navigation.navigate('FilterScreen', {
      sortBy,
      applyFilters: handleApplyFilters,
    });
  };

  const handleApplyFilters = (sortBy) => {
    setSortBy(sortBy);
  };

  useEffect(() => {
    const filteredHotels = hotels.filter((h) =>
      h.location.toLowerCase().includes(filter.toLowerCase())
    );

    if (sortBy === 'rating-desc') {
      filteredHotels.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'rating-asc') {
      filteredHotels.sort((a, b) => a.averageRating - b.averageRating);
    } else if (sortBy === 'alphabetical') {
      filteredHotels.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredHotels(filteredHotels);
  }, [filter, hotels, sortBy]);

  const navigateToDetails = (hotel) => {
    navigation.navigate('HotelDetailsScreen', { hotel });
  };

  const navigateToReservationListScreen = () => {
    navigation.navigate('ReservationListScreen');
  };

    const navigateToMainMenu = () => {
        navigation.navigate('MainMenu');
    };

  return (
    <View style={styles.container}>
      <View style={styles.topMenu}>
          <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
              <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="white" style={styles.searchIcon} />
          <TextInput
            placeholder="Enter your location"
            style={styles.searchInput}
            value={filter}
            onChangeText={(text) => setFilter(text)}
          />
        </View>
      </View>

        <ScrollView style={styles.hotelList}>
            {filteredHotels.length === 0 ? (
                <View style={styles.noHotelContainer}>
                    {/*  4 Beispiel Hotels */}
                    {[1, 2, 3, 4].map((index) => (
                        <TouchableOpacity key={index} style={styles.hotelContainer}>
                            <Image
                                source={{ uri: 'URL des Bildes hier einfügen' }}
                                style={styles.hotelImage}
                            />
                            <View style={styles.hotelInfo}>
                                <Text style={styles.hotelName}>Hotel {index}</Text>
                                <Text style={styles.hotelDescription}>Description of Hotel {index}</Text>
                                <Text style={styles.hotelDescription}>City: City {index}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                filteredHotels.map((hotel) => (
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
                ))
            )}
        </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.reservationButton} onPress={navigateToReservationListScreen}>
          <Icon name="calendar" size={20} color="white" />
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

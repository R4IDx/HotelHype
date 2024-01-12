import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';


const Stack = createNativeStackNavigator();
console.disableYellowBox=true;
console.error = () => {};

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          options={{ headerTitle: "", headerBackVisible: false }}
          name="Login"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
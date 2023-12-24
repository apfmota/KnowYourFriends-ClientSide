import * as React from 'react';
import { Text, Pressable, View, TextInput, StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NovoAmigo from './NovoAmigo';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import NovaGalera from './NovaGalera';
import Partida from './Partida';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Register" component={Register}/>
                <Stack.Screen name="NovoAmigo" component={NovoAmigo}/>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="NovaGalera" component={NovaGalera} options={({navigation, route}) => ({
                    headerLeft: () => (
                        <Text></Text>
                    ),
                    headerRight: () => {
                        const backToHome = () => {
                            route.params.carregado = false;
                            route.params.idGalera = 0;
                            navigation.navigate('Home', route.params);
                        }
                        return (
                            <Pressable onPress={backToHome}>
                                <Text>Pronto</Text>
                            </Pressable>
                        )
                    }
                })}/>
                <Stack.Screen name="Partida" component={Partida}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};
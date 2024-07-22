import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useAuthentication } from '../contexts/AuthContexts';

const SplashScreen = ({ navigation }) => {
    const { user } = useAuthentication();

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigation.replace('Home');
            }, 3000);
        } else {
            setTimeout(() => {
                navigation.replace('Login');
            }, 3000);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/splash.png')}
                style={styles.logo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'center',
        height: '110%'
    },
    logo: {
        width: '50%',
        height: 200,
        aspectRatio: 1,
        alignSelf: 'center',
        resizeMode: 'contain'
    }
});

export default SplashScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { letsLinkAPI } from '../utility/api';
import Loader from '../components/Loader';
import { useAuthentication } from '../contexts/AuthContexts';
import userSocket from '../socket';

const LoginScreen = ({ navigation }) => {
    const [showIndicator, setShowIndicator] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useAuthentication();
    const { height } = Dimensions.get('window');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        userSocket.initializeSocket();
    }, []);

    const handleLogin = () => {
        if (!email) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Email',
                autoClose: 2000,
            });
        } else if (!emailRegex.test(email)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Valid Email',
                autoClose: 2000,
            });
        } else if (!password) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Password',
                autoClose: 2000,
            });
        } else {
            setShowIndicator(true);
            letsLinkAPI('user/login', { email: email, password: password }, 'post')
                .then(async(res) => {
                    setShowIndicator(false);
                    if (res.data.status === 'success') {
                        setUser(res.data.data);
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: res.data.message,
                            autoClose: 2000,
                        });
                        userSocket.emit('userOnline', res.data.data?._id);
                        navigation.navigate('Home');
                    } else {
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'Error',
                            textBody: res.data.message,
                            autoClose: 2000,
                        });
                    }
                })
                .catch(async(e) => {
                    setShowIndicator(false);
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Error',
                        textBody: e.response?.data?.message ? e.response?.data.message : "Network Error",
                        autoClose: 2000,
                    });
                })
        }
    };

    return (
        <View style={{ flex: 1, height: (height / 100) * 100 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, height: '100%', paddingTop: 60 }}
            >
                {showIndicator === true ? <Loader /> : null}
                <View style={styles.auth_heading_View}>
                    <Text
                        variant="titleLarge"
                        style={styles.heading}>
                        Log in to Let’s Link
                    </Text>
                </View>
                <View style={styles.parahContainer}>
                    <Text variant="bodyMedium" style={styles.parah}>
                        Welcome back! Sign in using your social account or email to continue us
                    </Text>
                </View>
                <View style={{margin: 20}}>
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Your Email
                    </Text>
                    <TextInput
                        value={email}
                        onChangeText={email => setEmail(email)}
                        placeholder="Jhon@gmail.com"
                        placeholderTextColor="#797C7B"
                        style={[styles.textFeild, { color: '#252525' }]}
                    />
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Password
                    </Text>
                    <TextInput
                        value={password}
                        placeholderTextColor="#797C7B"
                        onChangeText={password => setPassword(password)}
                        placeholder="***********"
                        style={[styles.textFeild, { color: '#252525' }]}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity
                    style={[ styles.loginButton, { marginTop: (height / 100) * 22 }]}
                    onPress={() => handleLogin()}
                >
                    <Text style={styles.loginButtonTxt}>
                        Log in
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.register_now}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text
                        variant="titleMedium"
                        style={styles.register_text}
                    >
                        New User?
                        <Text style={styles.register_link}>
                            {' '}
                            Register
                        </Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    auth_heading_View: {
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 0,
    },
    heading: {
        color: '#000000',
        padding: 6,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
    },
    parahContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
    },
    parah: {
        color: '#797C7B',
        fontSize: 14,
        padding: 6,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    textLabel: {
        fontSize: 16,
        color: '#000000',
        padding: 10,
        paddingBottom: 0,
        fontFamily: 'Poppins-Medium',
    },
    textFeild: {
        height: 50,
        borderRadius: 6,
        borderBottomWidth: 1,
        borderColor: '#E2E4E7',
        color: '#000000',
        padding: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    loginButton: {
        width: '90%',
        height: 55,
        alignSelf: 'center',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6515AC'
    },
    loginButtonTxt: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Poppins-Medium'
    },
    register_now: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
        color: '#252525',
        fontFamily: 'Poppins-Medium'
    },
    register_text: {
        color: '#252525',
        fontFamily: 'Poppins-Medium'
    },
    register_link: {
        color: '#6515AC',
        fontFamily: 'Poppins-SemiBold'
    }
});

export default LoginScreen;
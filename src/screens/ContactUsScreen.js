import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as MailComposer from 'expo-mail-composer';
import { useAuthentication } from '../contexts/AuthContexts';

const ContactUsScreen = ({ navigation }) => {
    const [msg, setMsg] = useState('');
    const { user } = useAuthentication();
    const textInputRef = useRef(null);
    
    const sendFeedBack = () => {
        console.log('Sent!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <MaterialIcons
                        name={'arrow-back'}
                        size={24}
                        color={'#000000'}
                        style={{}}
                    />
                </TouchableOpacity>
                <Text style={styles.heading}>Contact Support </Text>
                <Text></Text>
            </View>
            <View style={styles.bodyContainer}>
                <TextInput
                    ref={textInputRef}
                    style={styles.textarea}
                    onChangeText={e => {
                        setMsg(e);
                    }}
                    value={msg}
                    maxLength={120}
                    placeholder={'Tell us how we can help'}
                    placeholderTextColor={'rgba(132, 129, 129, 1)'}
                    multiline={true}
                />
                <Text style={styles.bodyTxt}>
                    Include device information? (Optional){`\n`}Technical details like your model and settings can help us answer your question.
                </Text>
            </View>
            <Text style={styles.footerTxt}>
                We will respond to you at your email
            </Text>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => sendFeedBack()}
            >
                <Text style={styles.buttonTxt}>
                    Send Via Email
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        padding: 10,
        marginTop: 10,
        paddingBottom: 20,
    },
    heading: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '600',
        marginLeft: 15,
        fontFamily: 'Poppins-SemiBold',
    },
    bodyContainer: {
        flex: 1,
        width: '85%',
        height: '100%',
        alignSelf: 'center',
        marginTop: 30
    },
    textarea: {
        height: 180,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#EFE8E8',
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Medium'
    },
    bodyTxt: {
        marginTop: 20,
        fontSize: 12,
        color: '#000000',
        fontFamily: 'Poppins-Regular'
    },
    footerTxt: {
        position: 'relative',
        bottom: 50,
        left: 0,
        right: 0,
        marginTop: 20,
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        fontFamily: 'Poppins-Medium'
    },
    buttonContainer: {
        position: 'relative',
        left: 0,
        right: 0,
        bottom: 40,
        height: 50,
        width: '85%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#6515AC',
        borderRadius: 20
    },
    buttonTxt: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        fontFamily: 'Poppins-Bold'
    }
});

export default ContactUsScreen;
  
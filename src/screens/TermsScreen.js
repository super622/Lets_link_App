import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { letsLinkAPI } from '../utility/api';

const TermsScreen = ({ navigation }) => {
    const [data, setData] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            letsLinkAPI('content/getAll', {}, 'get')
                .then(async(res) => {
                    if (res.data.status == 'success') {
                        setData(res.data.data[0].condition);
                    }
                })
                .catch(async(e) => {
                    console.log(e);
                });
        }, []),
    );

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
                <Text style={styles.heading}>Terms of Service</Text>
                <Text></Text>
            </View>
            <WebView
                style={styles.webview}
                originWhitelist={['*']}
                source={{ html: data }}
                textZoom={300}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        fontFamily: 'Poppins-Medium',
    },
    bodyContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 10
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        fontFamily: 'Poppins-SemiBold'
    },
    content: {
        fontSize: 14,
        color: '#000000',
        marginTop: 5,
        fontFamily: 'Poppins-Regular'
    },
    webview: {
        margin: 10
    }
});

export default TermsScreen;

import React, { useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import { Text } from 'react-native-paper';

const ChatScreen = () => {
    return (
        <View style={styles.container}>
            <Text>ChatScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '110%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    }
});

export default ChatScreen;

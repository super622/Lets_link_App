import React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';

const Loader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.loader}>
                <UIActivityIndicator color={'white'} size={30} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        opacity: 1,
        zIndex: 222,
    },
    loader: {
        height: 100,
        width: 100,
        backgroundColor: 'rgba(45, 45, 45, 0.7)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Loader;
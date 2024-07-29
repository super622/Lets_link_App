import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  
const PayoutScreen = ({ navigation }) => {
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
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Payout
                </Text>
                <Text></Text>
            </View>
            <View style={styles.totalContent}>
                <Text style={styles.totalPayoutLabel}>Total Payouts</Text>
                <Text style={styles.totalPayoutValue}>$0.00</Text>
            </View>
            <View style={styles.bodyContainer}>
                <Text style={[styles.bodyText, { width: '30%', textAlign: 'center' }]}>Date</Text>
                <Text style={[styles.bodyText, { width: '30%', textAlign: 'center' }]}>Coin</Text>
                <Text style={styles.bodyText}>Amount</Text>
            </View>
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
        paddingBottom: 20
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        color: '#000000'
    },
    totalContent: {
        height: 70,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        flexDirection: 'row',
        borderBottomColor: 'rgba(228, 232, 230, 1)',
        borderBottomWidth: 1
    },
    totalPayoutLabel: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold'
    },
    totalPayoutValue: {
        color: 'rgba(101, 21, 172, 1)',
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold'
    },
    bodyContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        flexDirection: 'row',
        marginTop: 10
    },
    bodyText: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold'
    }
});

export default PayoutScreen;

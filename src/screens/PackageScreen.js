import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    Image,
    Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { letsLinkAPI } from '../utility/api';
import { useAuthentication } from '../contexts/AuthContexts';

const PackageScreen = ({ navigation }) => {
    const [packageList, setPackageList] = useState([]);
    const [link, setLink] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectpkg, setSelectedpkg] = useState({});

    const { user } = useAuthentication();

    useFocusEffect(
        React.useCallback(() => {
            letsLinkAPI('package/getAll', {}, 'get')
                .then(async(res) => {
                    if (res.data.status == "success") {
                        setPackageList(res.data.data);
                    }
                })
                .catch(async(e) => {
                    console.log(e);
                });
        }, []),
    );

    const handleBooking = val => {
        setSelectedpkg(val);
        letsLinkAPI('pay', { itemName: val?.packageName, itemPrice: val?.price, currency: 'USD' }, 'post')
            .then(async(res) => {
                if (res.data) {
                    setLink(res.data?.approval_url);
                    setShowModal(true);
                }
            })
            .catch(async(e) => {
                console.log(e);
            });
    };

    const handleWeb = (val) => {
        if (val?.title === 'success') {
            letsLinkAPI(`user/buyPackage/${user?._id}`, { packageName: selectpkg?.packageName, amount: selectpkg?.price, coins: selectpkg?.coins, packageId: selectpkg?._id })
                .then(async(res) => {
                    setShowModal(false);
                    if (res.data.status == 'success') {
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: res.data?.message,
                            autoClose: 2000
                        });
                    } else {
                        Toast.show({
                            type: ALERT_TYPE.WARNING,
                            title: 'Error',
                            textBody: res.data?.message,
                            autoClose: 2000
                        });
                    }
                })
                .catch(async(e) => {
                    console.log(e);
                });
        } else if (val?.title === 'cancel') {
            setShowModal(false);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Payment Cancelled',
                autoClose: 2000
            });
        } else {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Network Error',
                autoClose: 2000
            });
        }
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
                        color={'white'}
                        style={{}}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Coins
                </Text>
                <Pressable
                    onPress={() => navigation.navigate('Package')}
                    style={{ flexDirection: 'row' }}
                >
                    <Image
                        source={require('../assets/icons/coin.png')}
                        style={styles.logo}
                    />
                    <Pressable>
                        <Text style={styles.coinLabel}>
                            {user?.coins ? user?.coins : '0'}
                        </Text>
                        <Text style={styles.coinLabel}>
                            Coins
                        </Text>
                    </Pressable>
                </Pressable>
            </View>
            <View style={styles.packageContainer}>
                {packageList?.length > 0 && packageList?.map(item => {
                    return (
                        <TouchableOpacity
                            onPress={() => handleBooking(item)}
                            key={item?._id}
                            style={styles.packageItemContainer}
                        >
                            <View style={{height: '100%', width: '50%'}}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: 'Poppins-Medium',
                                        fontSize: 18,
                                        marginTop: 10,
                                    }}
                                >
                                    {item?.packageName}
                                </Text>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: 22,
                                    }}
                                >
                                    {item?.coins} Coins
                                </Text>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: 14,
                                        top: -10,
                                    }}
                                >
                                    ${item?.price}
                                </Text>
                            </View>
                            <View
                                style={{
                                    height: 40,
                                    width: 100,
                                    backgroundColor: 'rgba(101, 21, 172, 1)',
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontFamily: 'Poppins-Medium',
                                        fontSize: 18,
                                        alignSelf: 'center',
                                    }}
                                >
                                    Buy
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(!showModal)}
                style={{flex: 1, paddingTop: 40}}>
                <WebView
                    source={{ uri: link }}
                    style={{ flex: 1 }}
                    onNavigationStateChange={res => handleWeb(res)}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    cotainer: {
        flex: 1,
        backgroundColor: '#000000',
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
    headerTitle: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: 'Poppins-Medium'
    },
    logo: {
        width: 20,
        height: 35
    },
    coinLabel: {
        marginLeft: 5,
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: '#ffffff'
    },
    packageContainer: {
        flex: 1,
        paddingTop: 20,
        marginTop: 0,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    packageItemContainer: {
        width: '90%',
        height: 100,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        paddingHorizontal: '5%'
    }
});

export default PackageScreen;
  
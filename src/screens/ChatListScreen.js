import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthentication } from '../contexts/AuthContexts';
import { letsLinkAPI } from '../utility/api';
import moment from 'moment';

const ChatListScreen = ({ navigation }) => {
    const [chatList, setChatList] = useState([]);
    const { user } = useAuthentication();
  
    useFocusEffect(
        React.useCallback(() => {
            letsLinkAPI('user/getUserChat', { uid: user._id }, 'post')
                .then(async(res) => {
                    if(res.data.status == 'success') {
                        setChatList(res.data.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }, []),
    );
  
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => {}}>
                    <MaterialCommunityIcons
                        name={'menu'}
                        size={35}
                        color={'transparent'}
                        style={{width: 65}}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chats</Text>
                <Pressable 
                    onPress={()=> user?.gender === "male" ? navigation.navigate('Package') : console.log('Buy Coin')} 
                    style={{ flexDirection: 'row' }}
                >
                    <Image
                        source={require('../assets/icons/coin.png')}
                        style={styles.logo}
                    />
                    <Pressable >
                        <Text style={[styles.heading, { fontSize: 14 }]}>{user?.coins ? user?.coins : '0'}</Text>
                        <Text style={[styles.heading, { fontSize: 14 }]}>Coins</Text>
                    </Pressable>
                </Pressable>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={chatList}
                    renderItem={({ item }) => {
                        if (item?.blockedBy?.length > 0) {
                            return (
                                <>
                                    {item?.blockedBy?.map(e => {
                                        if (e === user?._id) {
                                            return null;
                                        } else {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate('Chat', {data: item});
                                                    }}
                                                    style={styles.card}
                                                >
                                                    <View style={styles.listItemContainer}>
                                                        <Image
                                                            style={styles.image}
                                                            source={{
                                                                uri: item?.other?.image,
                                                            }}
                                                        />
                                                        <View style={styles.statusIcon}></View>
                                                    </View>
                                                    <View style={{ width: '50%', marginLeft: 5 }}>
                                                        <Text style={styles.listItemName}>
                                                            {item?.other?.userName}
                                                        </Text>
                                                        <Text style={styles.listItemLastMsg}>
                                                            {item?.lastMessage?.text}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column', width: '20%' }}>
                                                        <Text
                                                            style={styles.listItemDate}
                                                            numberOfLines={1}
                                                        >
                                                            {moment(item?.lastMessage?.createdAt).fromNow()}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }
                                    })}
                                </>
                            );
                        } else {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Chat', { data: item });
                                    }}
                                    style={styles.card}
                                >
                                    <View style={styles.listItemContainer}>
                                        <Image
                                            style={styles.image}
                                            source={{
                                                uri: item?.other?.image,
                                            }}
                                        />
                                        <View style={styles.statusIcon}></View>
                                    </View>
                                    <View style={{ width: '50%', marginLeft: 5 }}>
                                        <Text style={styles.listItemName}>
                                            {item?.other?.userName}
                                        </Text>
                                        <Text style={styles.listItemLastMsg}>
                                            {item?.lastMessage?.text}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', width: '20%' }}>
                                        <Text
                                            style={styles.listItemDate}
                                            numberOfLines={1}
                                        >
                                            {moment(item?.lastMessage?.createdAt).fromNow()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: '15%',
        backgroundColor: '#000000'
    },
    headerContainer: {
        width: '100%',
        padding: 10,
        marginTop: 10,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
        color: '#ffffff'
    },
    heading: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: 'Poppins-Medium'
    },
    logo: {
        width: 20,
        height: 35,
        marginRight: 10
    },
    card: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '90%',
        height: 60,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 30
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 100
    },
    listContainer: {
        flex: 1,
        paddingTop: 20,
        marginTop: 0,
        backgroundColor: '#ffffff',
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40
    },
    listItemContainer: {
        width: '20%',
        height: '100%',
        marginTop: 10,
        flexDirection: 'row'
    },
    listItemName: {
        marginTop: 10,
        fontSize: 16,
        color: '#000000',
        textTransform: 'capitalize',
        fontFamily: 'Poppins-Medium'
    },
    listItemLastMsg: {
        top: -5,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#797C7B'
    },
    listItemDate: {
        marginTop: 10,
        fontSize: 10,
        color: '#797C7B',
        fontFamily: 'Poppins-Regular',
        textTransform: 'capitalize'
    },
    statusIcon: {
        width: 10,
        height: 10,
        position: 'absolute',
        bottom: 2,
        right: 7,
        backgroundColor: '#0FE16FD',
        borderRadius: 50
    }
});

export default ChatListScreen;

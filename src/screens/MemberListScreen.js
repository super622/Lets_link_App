import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthentication } from '../contexts/AuthContexts';
import { letsLinkAPI } from '../utility/api';
import userSocket from '../socket';

const MemberListScreen = ({ navigation }) => {
    const [memberList, setMemberList] = useState([]);
    const { user } = useAuthentication();
  
    useFocusEffect(
        React.useCallback(() => {
            userSocket.initializeSocket();
            setMemberList([]);
            letsLinkAPI('user/getAll', {}, 'post')
                .then(async(res) => {
                    if (res.data.status == 'success') {
                        const arr = res.data.data.filter(item => {
                            if (user?.gender == 'male') {
                                return item?.gender === 'female' && item?.status === 'approved';
                            } else {
                                return item?.gender === 'male' && item?.status === 'approved';
                            }
                        });
                        setMemberList(arr);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }, []),
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        
                    }}
                >
                    <MaterialCommunityIcons
                        name={'menu'}
                        size={35}
                        color={'transparent'}
                    />
                </TouchableOpacity>
                <Text style={styles.heading}>Let’s Chat </Text>
                <Pressable 
                    onPress={()=> navigation.navigate('Package')} 
                    style={{ flexDirection: 'row' }}
                >
                    <Image
                        source={require('../../assets/icons/coin.png')}
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
                    numColumns={3}
                    data={memberList}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                onPress={() => {
                                    navigation.navigate('MemberProfile', { data: item });
                                }}
                                style={styles.card}
                            >
                                <View style={{ flexDirection: 'row', height: '100%' }}>
                                    <Image
                                        style={styles.image}
                                        source={{
                                            uri: item?.image ? item?.image : null,
                                        }}
                                    />
                                    <View style={styles.statusIcon}></View>
                                </View>
                                <Text style={styles.listitemTxt}>
                                    {item?.userName}
                                </Text>
                            </Pressable>
                        );
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
    logo: {
        width: 20,
        height: 35,
        marginRight: 10
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
    heading: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: 'Poppins-Medium'
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '33.3%',
        borderRadius: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 30
    },
    image: {
        width: 100,
        borderRadius: 100,
        height: 100,
        backgroundColor: 'grey',
    },
    listContainer: {
        flex: 1,
        marginTop: 0,
        paddingTop: 20,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    statusIcon: {
        position: 'absolute',
        width: 15,
        height: 15,
        bottom: 5,
        right: 10,
        borderRadius: 50,
        backgroundColor: '#0FE16D'
    },
    listitemTxt: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
        color: '#000000'
    }
});

export default MemberListScreen;

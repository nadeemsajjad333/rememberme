import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ImagesCom} from '../../constant/images';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {GetUserList} from '../../component/APIscreen';
import Loading from '../../component/Loading';

import moment from 'moment';
import {FontsFmily} from '../../constant/fonts';
import {Colors} from '../../constant/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ChatList = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  const [Membermodal, setMembermodal] = useState(false);
  const [AllUsers, setAllUsers] = useState([]);

  const [List, setList] = useState([]);
  // console.log('AllUsers users[[[[[[][][]]][', AllUsers);
  const _usersList = useCallback(async () => {
    try {
      database()
        .ref('users/' + user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .on('value', dataSnapshot => {
          let users = [];
          dataSnapshot.forEach(child => {
            users.push(child.val());
          });

          setList(users.reverse());
        });
    } catch (error) {}
  }, []);

  useEffect(() => {
    _usersList();
  }, []);

  const getAllusers = async () => {
    GetUserList({url: 'user-all', Auth: user.userdata.api_token})
      .then(res => {
        console.log('response of all users', res);
        setAllUsers(res.userdata);
      })
      .catch(err => {
        console.log('error in users', err);
      });
  };
  const {top} = useSafeAreaInsets();

  return (
    <View style={[Stylsheet.container]}>
      <View
        style={{
          //  flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: wp(100),
          height: 70,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <TouchableOpacity
          style={{marginLeft: 10, position: 'absolute', left: 5}}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
        </TouchableOpacity>
        <Text style={[Stylsheet.semibldTxt, {textAlign: 'center'}]}>
          {'Chat'}
        </Text>
      </View>

      <View style={{marginTop: 10, flex: 1}}>
        <FlatList
          data={List}
          renderItem={({item, index}) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Chat', {item: item.user})}
                  activeOpacity={0.6}
                  style={Stylsheet.card}>
                  <View style={Stylsheet.list_View1}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 30}}
                      source={{uri: item.user.image}}
                      resizeMode="contain"
                    />
                  </View>

                  <View
                    style={[
                      Stylsheet.list_View2,
                      {justifyContent: 'space-evenly'},
                    ]}>
                    <Text style={[Stylsheet.b0ldTxt, {paddingLeft: 10}]}>
                      {item.user.username}
                    </Text>
                    <View>
                      {item.latestMessage.slice(-4) == '.jpg' ? (
                        <View style={{flexDirection: 'row', paddingLeft: 7}}>
                          <MaterialIcons
                            name="photo"
                            size={20}
                            style={{color: '#000'}}
                          />
                          <Text
                            style={[
                              Stylsheet.regulrtxt,
                              {paddingLeft: 5, color: '#7B7B7B'},
                            ]}>
                            {'Photo'}
                          </Text>
                        </View>
                      ) : item?.latestMessage === '' ? (
                        <View style={{flexDirection: 'row', paddingLeft: 5}}>
                          <MaterialIcons
                            name="mic"
                            size={20}
                            style={{color: '#000'}}
                          />
                          <Text
                            style={[
                              Stylsheet.regulrtxt,
                              {paddingLeft: 5, color: '#7B7B7B'},
                            ]}>
                            {'Voice'}
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={[
                            Stylsheet.regulrtxt,
                            {paddingLeft: 10, color: '#7B7B7B'},
                          ]}>
                          {item.latestMessage}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={Stylsheet.list_View3}>
                    <Text
                      style={[
                        Stylsheet.regulrtxt,
                        {
                          paddingLeft: 35,
                          color: '#2b2b2b',
                          top: 11,
                          fontSize: 12,
                        },
                      ]}>
                      {moment(item.timestamp).format('hh:mm A')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            );
          }}
        />

        <TouchableOpacity
          onPress={() => {
            setMembermodal(true), getAllusers();
          }}
          style={{alignSelf: 'flex-end', margin: 25}}>
          <Image
            style={{width: 40, height: 40}}
            source={ImagesCom.cht}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Modal transparent={true} animationType={'none'} visible={Membermodal}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <View style={Stylsheet.chatlist}>
              <TouchableOpacity onPress={() => setMembermodal(false)}>
                <AntDesign
                  name="arrowleft"
                  size={22}
                  style={{color: '#000', left: 18}}
                />
              </TouchableOpacity>
              <Text style={Stylsheet.semibldTxt}>Select Members</Text>
              <Text style={Stylsheet.semibldTxt}>{''}</Text>
            </View>

            <View style={{flex: 1}}>
              <FlatList
                data={AllUsers}
                ListEmptyComponent={() => {
                  return (
                    <View style={{marginTop: 250, alignItems: 'center'}}>
                      <Text
                        style={{
                          color: Colors.gray,
                          fontSize: 14,
                          fontFamily: FontsFmily.Medium,
                        }}>
                        You don't have any family member
                      </Text>
                    </View>
                  );
                }}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(
                          'Chat',
                          {item: item},
                          setMembermodal(false),
                        )
                      }
                      style={[
                        Stylsheet.flexdirec,
                        {
                          margin: 2,
                          borderBottomWidth: 1,
                          borderBottomColor: '#D2D2D2',
                        },
                      ]}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          left: 5,
                        }}
                        source={{uri: item.image}}
                        resizeMode="contain"
                      />
                      <Text style={[Stylsheet.b0ldTxt, {padding: 20}]}>
                        {item.username}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ChatList;

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {
  AddEventAPI,
  AllPostApi,
  GetUserList,
  RegisterApi,
} from '../../component/APIscreen';
import {useSelector} from 'react-redux';
import {FontsFmily} from '../../constant/fonts';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import Loading from '../../component/Loading';
import crashlytics from '@react-native-firebase/crashlytics';
import AndroidToast from '../../component/AndroidToast';

const CreateEvent = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [Membermodal, setMembermodal] = useState(false);
  const [TemplatesModal, setTemplatesModal] = useState(false);
  const maxLength = 100;
  const [image, setImage] = useState('');
  const [descrip, setDescrip] = useState('');
  const [getsername, setGetusername] = useState('');
  const [flatlistData, setflatlistData] = useState([]);
  const [userId, setuserId] = useState('');

  console.log('response of userId', userId);
  
  const [userModal, setUserModal] = useState(false);
  const [openCalender, setOpenCalender] = useState(false);
  const [heart, setheart] = useState('');

  const [dates, setDates] = useState(new Date());
  const [dat, setDat] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const picker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
    });
  };

  const PushUser = async text => {
    setGetusername(text);
    GetUserList({url: `user-list/${text}`, Auth: user?.userdata?.api_token})
      .then(res => {
        console.log('response of getuserList', res);
        if (res.status == 'success') {
          setflatlistData(res.userdata);
          setUserModal(true);
        }
      })
      .catch(err => {
        console.log('error of Get users', err);
        crashlytics().recordError(err);
      });
  };

  const EventPush = async () => {
    // Check if all required fields are filled
    if (!getsername && !dat) {
      AndroidToast('Username and Event date are required.')
      return;
    }
  
    const formdata = new FormData();
   if(image){
    formdata.append('image', {
      uri: image,
      type: 'image/jpg',
      name: `image${new Date().toISOString()}.jpg`,
    });
   }
    formdata.append('title', getsername);
    formdata.append('description', descrip);
    formdata.append('receiver_id', userId);
    formdata.append('dob', moment(dat).format('YYYY-MM-D'));
  
    AddEventAPI({ url: 'add-event', Auth: user?.userdata?.api_token }, formdata)
      .then(res => {
        console.log('api ressssssssss', res);

        
        
        setGetusername('');
        setDat('');
        setDescrip('');
        setImage('');
        navigation.navigate('Templates', { items: res.event_data });
      })
      .catch(err => {
        console.log('api error', err);
      });
  };
  return (
    <View style={Stylsheet.container}>
      {Membermodal && <Loading />}
      <View style={Stylsheet.chatlist}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('IndexBottom'), setTemplatesModal(false);
          }}>
          <AntDesign
            name="arrowleft"
            size={22}
            style={{color: '#000', left: 18}}
          />
        </TouchableOpacity>
        <Text style={Stylsheet.semibldTxt}>Create Event</Text>
        <Text style={Stylsheet.semibldTxt}>{''}</Text>
      </View>
      <ScrollView>
        <View style={{paddingBottom: 30}}>
          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 40}}
            onPress={() => picker()}>
            <Image
              style={[Stylsheet.prfileimg,{borderColor:'grey'}]}
              source={image ? {uri: image} : ImagesCom.avatar}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={{height: 390, justifyContent: 'space-between'}}>
            <View style={{alignSelf: 'center'}}>
              <Text style={Stylsheet.outtxtinpt}>Username</Text>
              <View style={Stylsheet.textinptBox}>
                <Image
                  style={Stylsheet.inputicon}
                  source={ImagesCom.user}
                  resizeMode="contain"
                />

                <TextInput
                  style={Stylsheet.TextInputS}
                  placeholder="Enter username"
                  placeholderTextColor={Colors.gray}
                  value={getsername}
                  onChangeText={text => {
                    PushUser(text);
                  }}
                />
              </View>
              {/* <View style={}></View> */}
            </View>
            {/* Modalllllllllllllllllllllll */}

            <Modal
              transparent={true}
              animationType={'none'}
              visible={userModal}>
              <TouchableOpacity
                onPress={() => setUserModal(false)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent:'center',
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    width: 160,
                    // minHeight:70,
                    maxHeight:140,
                    padding: 5,
                    backgroundColor: Colors.ligtgray,
                    bottom:60,
                    marginRight: 150,
                    borderRadius: 10,
                  }}>
                  <FlatList
                    data={flatlistData}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setUserModal(false),
                              setGetusername(item.username),
                              setuserId(item.id);
                          }}
                          style={{margin: 5,}}>
                          <Text
                            style={{
                              color: '#000',
                              paddingLeft: 5,
                              fontFamily: FontsFmily.Regular,
                              fontSize: 14,
                            }}>
                            {item.username}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={{alignSelf: 'center'}}>
              <Text style={Stylsheet.outtxtinpt}>Event Date</Text>
              <View style={Stylsheet.textinptBox}>
                <FontAwesome5
                  name="birthday-cake"
                  size={16}
                  style={{marginLeft: 16, color: '#000'}}
                />
                <TextInput
                  style={Stylsheet.TextInputS}
                  placeholder="Select Date"
                  placeholderTextColor={Colors.gray}
                  value={dat ? moment(dat).format('YYYY-MM-D') : 'Select Date'}
                  onFocus={() => setOpenCalender(true)}
                />
              </View>
            </View>

            <View style={{alignSelf: 'center'}}>
              <Text style={Stylsheet.outtxtinpt}>Greeting</Text>
              <View
                style={[
                  Stylsheet.textinptBox,
                  {height: 160, alignItems: 'flex-start'},
                ]}>
                <Image
                  style={[Stylsheet.inputicon, {top: 20}]}
                  source={ImagesCom.greet}
                  resizeMode="contain"
                />

                <TextInput
                  style={[
                    Stylsheet.TextInputS,
                    {height: 140, width: 250, marginVertical: 10},
                  ]}
                  placeholder="Write here...."
                  placeholderTextColor={Colors.gray}
                  textAlignVertical="top"
                  numberOfLines={7}
                  maxLength={maxLength}
                  multiline={true}
                  value={descrip}
                  onChangeText={Text => {
                    setDescrip(Text);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop: 50}}>
            <Button title={'Continue'} onPress={() => EventPush()} />
          </View>
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        androidVariant="nativeAndroid"
        // theme='auto'
        // confirmText='set'
        open={openCalender}
        date={dates}
        onConfirm={dates => {
          setOpenCalender(false);
          setDat(dates);
        }}
        onCancel={() => {
          setOpenCalender(false);
        }}
      />
    </View>
  );
};

export default CreateEvent;

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ImagesCom} from '../../constant/images';
import {AllGetAPI, AllGetAPI2} from '../../component/APIscreen';
import {useSelector} from 'react-redux';
import Loading from '../../component/Loading';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import crashlytics from '@react-native-firebase/crashlytics';

const Notification = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const isFocused = useIsFocused();

  const [NotiData, setNotiData] = useState([]);
  const [Readdata, setReaddata] = useState([]);
  const [Indicator, setIndicator] = useState(false);
  const [ImageModal, setImageModal] = useState(false);
  const [image, setImage] = useState('');
  console.log('NotiData', NotiData);

  
  useEffect(() => {
    if (isFocused) {
      NotificarionApi();
      ReadDataAPI()
    }
  }, [isFocused,]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  setTimeout(() => {
    NotiData
  }, 10000);

  const NotificarionApi = async () => {
    // setIndicator(true);
    AllGetAPI({url: 'notification-list', Auth: user.userdata.api_token})
      .then(res => {
        setNotiData(res.data);
        // setIndicator(false);
      })
      .catch(err => {
        console.log('err in notification', err);
        crashlytics().recordError(err);
        // setIndicator(false);
      });
  };
  const images = [
    { uri: image},

    // Add more images as needed
  ];

  // const Delete = async uid => {
  //   Notification_Delete({url: 'notification-delete', Auth: user.token, id: uid})
  //     .then(res => {
  //       console.log('response of Delete', res);
  //       NotificarionApi();
  //     })

  //     .catch(err => {
  //       console.log('err in Delete', err);
  //     });
  // };

  const ReadDataAPI = async () => {
    AllGetAPI2({
      url: 'set-notification-read-all',
      Auth: user.userdata.api_token,
    })
      .then(res => {
        console.log('response of readstatus', res);
        setReaddata(res);
      })
      .catch(err => {
        console.log('err in readstatus', err.response.data);
        crashlytics().recordError(err);
      });
  };

  return (
    <View style={Stylsheet.container}>
      {Indicator && <Loading />}
      <View style={[Stylsheet.chatlist,{justifyContent:'center',alignItems:'center'}]}>
        <TouchableOpacity
        style={{position:'absolute',left:0}}
          onPress={() => {
            navigation.goBack(true), ReadDataAPI();
          }}>
          <AntDesign
            name="arrowleft"
            size={22}
            style={{color: '#000', left: 18}}
          />
        </TouchableOpacity>
        <Text style={[Stylsheet.semibldTxt,{textAlign:'center'}]}>Notification</Text>
        {/* <Text style={Stylsheet.semibldTxt}>{''}</Text> */}
      </View>

      <View style={{marginTop: 10}}>
        <FlatList
          data={NotiData}
          renderItem={({item, index}) => {
            return (
              <>
                <TouchableOpacity
                onPress={()=> {
                  if(item.type == 'withdraw_request'){
                    setImageModal(true)

                  }setImage(item.image)}}
                  activeOpacity={0.6}
                  style={[
                    Stylsheet.card,
                    {
                      backgroundColor:
                        Readdata.unread_count?.length > 0 ? '#E6E6E6' : '#fff',
                    },
                  ]}>
                  <View style={Stylsheet.list_View1}>
                    <View style={Stylsheet.bell_View}>
                      <MaterialCommunityIcons
                        name="bell"
                        size={27}
                        style={{color: '#C83037'}}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      Stylsheet.list_View2,
                      {justifyContent: 'space-evenly', width: 205},
                    ]}>
                    <Text style={[Stylsheet.b0ldTxt, {paddingLeft: 10}]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        Stylsheet.regulrtxt,
                        {paddingLeft: 10, color: '#7B7B7B', width: 270},
                      ]}>
                      {item.message.length > 20
                        ? item.message.substring(0, 50) + '...'
                        : item.message}
                    </Text>
                  </View>
                  <View style={Stylsheet.list_View3}>
                    <Text
                      style={[
                        Stylsheet.regulrtxt,
                        {
                          paddingLeft: 10,
                          color: '#2b2b2b',
                          top: 7,
                          fontSize: 12,
                        },
                      ]}>
                      {moment(item.date).format('hh:mm A')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            );
          }}
        />
      </View>
{      <ImageView
  images={images}
  imageIndex={0}
  visible={ImageModal}
  onRequestClose={() => setImageModal(false)}
/>}

        
      {/* <Modal transparent={true} animationType={'none'} visible={ImageModal}>
        <TouchableOpacity 
        onPress={()=>setImageModal(false)}
        style={Stylsheet.modalBackground}>
          <Image
          style={{width:wp(80),height:hp(50),borderRadius:10}}
          source={{uri:image}}
          resizeMode='contain'/>
       
        </TouchableOpacity>
      </Modal> */}
    </View>
        
  
  );
};

export default Notification;

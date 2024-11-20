import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {FontsFmily} from '../../constant/fonts';
import {AllGetAPI, UserMedia} from '../../component/APIscreen';
import Loading from '../../component/Loading';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const MediaDetail = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);

  const [Membermodal, setMembermodal] = useState(false);
  const [ViewDeta, setViewDeta] = useState([]);
  const isFocused = useIsFocused();
  // useEffect(() => {
  //   DeatilPush();
  // }, [])
  useEffect(() => {
    if (isFocused) {
      DeatilPush();
      console.log('Screen is focused');
    }
  }, [isFocused]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //   DeatilPush();
  //   });
  //   return unsubscribe;
  // }, []);

  const DeatilPush = async () => {
    setMembermodal(true);
    AllGetAPI({url: 'my-media', Auth: user.userdata.api_token})
      .then(res => {
        setViewDeta([res]);
        setMembermodal(false);

        console.log('res', res);
      })
      .catch(err => {
        console.log('err in article-list', err);
        setMembermodal(false);
      });
  };

  return (
    <View style={Stylsheet.container}>
      {Membermodal && <Loading />}
      <View
        style={{
          width: '100%',
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={Stylsheet.semibldTxt}>{'     '}</Text>

        <Text style={Stylsheet.semibldTxt}>My Data</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>
      <ScrollView>
        <View
          style={{
            alignSelf: 'center',
            marginTop: 40,
            height: 300,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PhotoMedia')}
            style={Stylsheet.Media_Dbox}>
            <Image
              style={[Stylsheet.media_imgB, {left: 4}]}
              source={ImagesCom.img2}
              resizeMode="contain"
            />

            <View style={{paddingLeft: 35}}>
              <Text style={[Stylsheet.b0ldTxt, {}]}>Photos Media</Text>

              {ViewDeta.map(element => {
                return (
                  <Text style={Stylsheet.Txt2}>
                    {element.photos
                      ? element?.photos + ' photo added'
                      : 'There are no photos included in this media type'}
                  </Text>
                );
              })}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('VideoMedia')}
            style={Stylsheet.Media_Dbox}>
            <Image
              style={Stylsheet.media_imgB}
              source={ImagesCom.img3}
              resizeMode="contain"
            />

            <View style={{paddingLeft: 35}}>
              <Text style={[Stylsheet.b0ldTxt, {}]}>Videos Media </Text>

              {ViewDeta.map(element => {
                return (
                  <Text style={Stylsheet.Txt2}>
                    {element.videos
                      ? element?.videos + ' video added'
                      : 'There are no videos included in this media type'}
                  </Text>
                );
              })}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('DocumentMedia')}
            style={Stylsheet.Media_Dbox}>
            <Image
              style={Stylsheet.media_imgB}
              source={ImagesCom.img4}
              resizeMode="contain"
            />

            <View style={{paddingLeft: 35}}>
              <Text style={[Stylsheet.b0ldTxt, {}]}>Documents</Text>
              {ViewDeta.map(element => {
                return (
                  <Text style={Stylsheet.Txt2}>
                    {element.docs
                      ? element?.docs + ' document added'
                      : 'There are no files included in this media type'}
                  </Text>
                );
              })}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MediaDetail;

import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stylsheet from '../../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../../constant/images';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FontsFmily} from '../../../constant/fonts';
import Clipboard from '@react-native-clipboard/clipboard';
import {AllGetAPI} from '../../../component/APIscreen';
import {useSelector} from 'react-redux';
import Loading from '../../../component/Loading';
import {useIsFocused} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-simple-toast';
export default function JoinedPeople({navigation}) {
  const user = useSelector(state => state.user.user);
  const [joinedPeople, setPoinedPeople] = useState([]);
  const [ReferrelCode, setReferrelCode] = useState(
    user.userdata.public_referral_code,
  );
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const handleCopy = () => {
    Clipboard.setString(ReferrelCode);
    Toast.show('Text copied to clipboard');
    // alert('Text copied to clipboard');
  };

  useEffect(() => {
    if (isFocused) {
      GetjoinPeople();
    }
  }, [isFocused]);

  const GetjoinPeople = async () => {
    setLoading(true);
    AllGetAPI({url: 'users-joined-by-refer', Auth: user.userdata.api_token})
      .then(res => {
        setPoinedPeople(res);
        setLoading(false);
      })
      .catch(err => {
        console.log('err in joined-by-refer', err);
        crashlytics().recordError(err);
        setLoading(false);
      });
  };

  return (
    <View style={Stylsheet.container}>
      {loading && <Loading />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{left: 10}}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
        </TouchableOpacity>
        <Text style={Stylsheet.semibldTxt}>Earning's</Text>
        <TouchableOpacity
          style={{right: 15}}
          onPress={() =>
            navigation.navigate('WithDraw', {
              currentAmount: joinedPeople?.amount,
            })
          }>
          <Text style={Stylsheet.amount}>Amount</Text>
          <View style={[Stylsheet.flexdirec, {alignItems: 'center'}]}>
            <Image
              style={{width: 14, height: 14}}
              source={ImagesCom?.amount}
              resizeMode="contain"
            />
            <Text
              style={[
                Stylsheet.amount,
                {color: 'gray', fontSize: 14, paddingLeft: 3},
              ]}>
              {joinedPeople?.amount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        <View style={{alignSelf: 'center', marginTop: 35}}>
          <Text
            style={[Stylsheet.outtxtinpt, {fontFamily: FontsFmily.Semibold}]}>
            Referrel Code
          </Text>
          <View style={Stylsheet.textinptBox}>
            <Image
              style={[
                Stylsheet.inputicon,
                {tintColor: null, width: 18, height: 18},
              ]}
              source={ImagesCom.Group}
              resizeMode="contain"
            />

            <TextInput
              style={[Stylsheet.TextInputS, {color: '#9F9F9F'}]}
              placeholder="075HQ87"
              placeholderTextColor={'#000'}
              value={ReferrelCode}
              onChangeText={text => setReferrelCode(text)}
              editable={false}
            />
            <TouchableOpacity onPress={() => handleCopy()} style={{}}>
              <Image
                style={[
                  Stylsheet.inputicon,
                  {tintColor: null, width: 18, height: 18, marginLeft: 0},
                ]}
                source={ImagesCom.copy}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={[
            Stylsheet.outtxtinpt,
            {fontFamily: FontsFmily.Semibold, marginTop: 20, left: 25},
          ]}>
          Joined People
        </Text>

        <View style={{marginTop: 10, alignSelf: 'center', height: hp(73)}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={joinedPeople?.userdata}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#D5393C',
                    fontFamily: FontsFmily.Medium,
                  }}>
                  No users will join by refer code
                </Text>
              </View>
            )}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.4}
                  //   onPress={() => {
                  //     if (onchange == 'invite') {
                  //       onShare();
                  //     }
                  //   }}
                  style={Stylsheet.invite_flat}>
                  <Image
                    style={[Stylsheet.invite_fltimg, {left: 5}]}
                    source={{uri: item?.image}}
                    resizeMode="contain"
                  />
                  <Text style={[Stylsheet.invite_flttxt, {}]}>
                    {item?.username}
                  </Text>
                  <View style={Stylsheet.invite_view2}>
                    <Image
                      style={{width: 15, height: 15}}
                      source={ImagesCom?.join}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

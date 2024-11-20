import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {useDispatch, useSelector} from 'react-redux';
import {UpdateProfile} from '../../component/APIscreen';
import Loading from '../../component/Loading';
import {setUser} from '../../ReduxToolkit/MyUserSlice';
import AndroidToast from '../../component/AndroidToast';
import CountryPickerModal from 'react-native-country-picker-modal';
import crashlytics from '@react-native-firebase/crashlytics';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const EditProfile = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  console.log('edit profile redux', user);
  const dispatch = useDispatch();

  const [image, setImage] = useState(user?.userdata?.image);
  const [username, setusername] = useState(user?.userdata?.username);
  const [email, setEmail] = useState(user?.userdata?.email);
  const [phone, setPhone] = useState(user?.userdata?.phoneno);
  const [selectedCountry2, setSelectedCountry2] = useState(
    user?.userdata?.country,
  );

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountryErr, setSelectedCountryErr] = useState(false);
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [tickCheck, setTickCheck] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  // console.log('object', selectedCountry);

  const EditData = async () => {
    setIsLoading(true);
    const token = user.userdata.api_token;
    const contri = selectedCountry.name;
    console.log('contri contri contri', contri);
    const formdata = new FormData();
    formdata.append('image', {
      uri: image,
      type: 'image/jpg',
      name: `image${new Date()}.jpg`,
    }),
      formdata.append('image', image),
      formdata.append('username', username),
      formdata.append('phoneno', phone),
      formdata.append('country', contri ? contri : selectedCountry2);
    UpdateProfile({url: 'edit', Auth: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('updateprofile response', res);
        if (res.status == 'success') {
          AndroidToast(res.message);
          dispatch(setUser(res));
          setIsLoading(false);
          navigation.navigate('IndexBottom');
        }
      })
      .catch(err => {
        console.log('err in updateprofile', err);
        crashlytics().recordError(err);
        setIsLoading(false);
      });
  };

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

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
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {isloading && <Loading />}
        <View style={{paddingBottom: 65}}>
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
              onPress={() => navigation.navigate('IndexBottom')}>
              <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
            </TouchableOpacity>
            <Text style={[Stylsheet.semibldTxt, {textAlign: 'center'}]}>
              {'Edit Profile'}
            </Text>
          </View>
          <ScrollView>
            <View>
              <TouchableOpacity
                style={{marginTop: 40, alignSelf: 'center'}}
                onPress={() => picker()}>
                <Image
                  style={Stylsheet.prfileimg}
                  source={image ? {uri: image} : ImagesCom.prologo}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={picker}
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: wp(11),
                  marginTop: 40,
                  backgroundColor: 'rgba(0,0,0,.5)',
                }}>
                <Feather name="camera" size={25} color={'white'} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 330,
                justifyContent: 'space-between',
                marginTop: 35,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Username</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.user}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS]}
                    placeholder="Enter Username"
                    placeholderTextColor={'#000'}
                    value={username}
                    onChangeText={Text => {
                      setusername(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>E-mail</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.mail}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS, {color: '#9F9F9F'}]}
                    placeholder="Xmaddy@gmail.com"
                    placeholderTextColor={'#9F9F9F'}
                    editable={false}
                    value={email}
                    onChangeText={Text => {
                      setEmail(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Phone No</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.phone}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[Stylsheet.TextInputS]}
                    placeholder=""
                    placeholderTextColor={'#000'}
                    value={phone}
                    keyboardType="phone-pad"
                    onChangeText={Text => {
                      setPhone(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Country</Text>
                {selectedCountry ? (
                  <>
                    <View
                      style={[
                        Stylsheet.textinptBox,
                        {borderColor: selectedCountryErr ? 'red' : '#CFCFCF'},
                      ]}>
                      {!selectedCountry ? (
                        <View>
                          <Image
                            style={Stylsheet.inputicon}
                            source={ImagesCom.flag}
                            resizeMode="contain"
                          />
                        </View>
                      ) : null}

                      <View style={{paddingLeft: 10}}>
                        <CountryPickerModal
                          visible={isCountryPickerVisible}
                          onClose={() => {
                            setCountryPickerVisible(false);
                          }}
                          withFilter={true}
                          withFlag={true}
                          withCountryNameButton={true}
                          // placeholder="Select a Country"
                          placeholderTextColor="gray"
                          countryCode={selectedCountry?.cca2}
                          onSelect={handleCountrySelect}
                          onChangeText={Text => {
                            selectedCountry(Text);
                            setSelectedCountryErr('');
                          }}
                          //   translation="eng"
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleCountrySelect}
                    style={Stylsheet.textinptBox}>
                    <Image
                      style={Stylsheet.inputicon}
                      source={ImagesCom.flag}
                      resizeMode="contain"
                    />

                    <TextInput
                      style={[Stylsheet.TextInputS]}
                      placeholder=""
                      placeholderTextColor={'#000'}
                      editable={false}
                      value={selectedCountry2}
                      keyboardType="phone-pad"
                      onChangeText={txt => setSelectedCountry2(txt)}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                height: 70,
                justifyContent: 'space-between',
                marginTop: 60,
                alignSelf: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === 'ios' ? 50 : 0,
              }}>
              <Button
                title={'Update'}
                onPress={() => {
                  EditData();
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Wrapper>
  );
};

export default EditProfile;

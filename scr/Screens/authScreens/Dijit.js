import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ImagesCom } from '../../constant/images';
import { Colors } from '../../constant/colors';
import Button from '../../constant/button';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { FontsFmily } from '../../constant/fonts';
import { AllPostApi, referCodeAPI } from '../../component/APIscreen';
import Loading from '../../component/Loading';
import { setUser } from '../../ReduxToolkit/MyUserSlice';
import { useDispatch, useSelector } from 'react-redux';
import AndroidToast from '../../component/AndroidToast';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const CELL_COUNT = 7;

const Dijit = ({ navigation, route }) => {
  const { token } = route.params;
  const { mail } = route.params;
  const { pass } = route.params;

  const dispatch = useDispatch();
  const [loader, setloader] = useState(false);
  const [Selection_modal, setSelection_modal] = useState(false);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [referralId, setReferralID] = useState(null);

  const userItems = list.map(user => ({
    label: user.username,
    value: user.id,
  }));

  const handleUserChange = value => {
    const selectedUserData = list?.find(user => user.id === value);
    if (selectedUserData) {
      setSelectedUser(selectedUserData.username);
      setReferralID(selectedUserData.id);
    } else {
      console.warn(`User with referral code ${value} not found.`);
    }
  };

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const updateForPublic = async () => {
    referCodeAPI({
      url: 'update-user-code',
      Auth: token.userdata.api_token,
      parent_referral_code: value,
      operation: 'view',
    })
      .then(res => {
        console.log('update-user-code', res);
        AndroidToast(res.message)
        if (res.is_public == true) {
          Login();
        } else if (res.status == 'success') {
          AndroidToast(res.message);
          setSelection_modal(true);
          setList(res.userlist);
        }
      })
      .catch(err => {
        console.log('err in login', err);
      });
  };

  console.log(':::', referralId);
  const updateForRelation = async () => {
    referCodeAPI({
      url: 'update-user-code',
      Auth: token.userdata.api_token,
      parent_referral_code: referralId,
      operation: 'add',
    })
      .then(res => {
        console.log('update-user-code', res);
        AndroidToast(res.message);

        if (res.status == 'success') {
          setSelection_modal(false);
          Login();
        }
      })
      .catch(err => {
        console.log('err in login', err);
      });
  };
  const Login = async () => {
    AllPostApi({ url: 'login', email: mail, password: pass })
      .then(res => {
        dispatch(setUser(res));
      })
      .catch(err => {
        console.log('err in login', err);
      });
  };

  return (
    <View style={Stylsheet.container}>
      <View style={{
        //  flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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

      }}>
        <TouchableOpacity
          style={{ marginLeft: 10, position: 'absolute', left: 5 }}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{ color: '#000' }} />
        </TouchableOpacity>
        <Text style={[Stylsheet.semibldTxt, { textAlign: 'center' }]}>{'7 Digit Code'}</Text>
      </View>
      <ScrollView>
        <View style={{marginBottom:20}}>
         

          <Image
            style={Stylsheet.dijitimg}
            source={ImagesCom.dijicon}
            resizeMode="contain"
          />

          <Text
            style={[
              Stylsheet.regulrtxt,
              {
                textAlign: 'center',
                marginTop: 25,
                fontFamily: FontsFmily.Medium,
              },
            ]}>
            You have the 7 digit family code. Now you can{'\n'}continue using the app.
          </Text>

          <View style={[Stylsheet.codeBox, { alignSelf: 'center' }]}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={Stylsheet.codeFieldRoot}
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[Stylsheet.cell, isFocused && Stylsheet.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <View style={{ marginTop: 70 }}>
            <Button title={'Continue'} onPress={() => updateForPublic()} />
          </View>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={Selection_modal}>
        <View style={Stylsheet.modalBackground}>
          <View style={[Stylsheet.activityIndicatorWrapper, { height: hp(67) }]}>
            <Image
              style={[Stylsheet.MemIconimg, { marginTop: 25 }]}
              source={ImagesCom.relationIcon}
              resizeMode="contain"
            />
            <Text
              style={[
                Stylsheet.regulrtxt,
                {
                  textAlign: 'center',
                  fontFamily: FontsFmily.Medium,
                  marginTop: 25,
                  marginHorizontal: 20,
                },
              ]}>
              Select Your relation with the family member.
            </Text>
            <View style={{ marginTop: 20 }}>
              <DropDownPicker
                open={open}
                value={referralId}
                items={userItems}
                setOpen={setOpen}
                setValue={setReferralID}
                setItems={() => { }}
                placeholder="Select Parent"
                containerStyle={{ height: 40 }}
                onChangeValue={value => handleUserChange(value)}
                style={{
                  width: wp(85),
                  alignSelf: 'center',
                  borderColor: 'transparent',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                }}
                dropDownContainerStyle={{
                  width: wp(85),
                  alignSelf: 'center',
                  borderColor: 'transparent',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                }}
              />
            </View>

            <View style={{ marginTop: 20, }}>
              <Button
                title={'Done'}
                onPress={() => {
                  updateForRelation(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dijit;

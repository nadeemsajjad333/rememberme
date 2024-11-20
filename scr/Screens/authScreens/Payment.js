import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../constant/images';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {AllPostApi} from '../../component/APIscreen';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../ReduxToolkit/MyUserSlice';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CardField, CardForm, useStripe} from '@stripe/stripe-react-native';
import Loading from '../../component/Loading';
import {FontsFmily} from '../../constant/fonts';
import AndroidToast from '../../component/AndroidToast';
import crashlytics from '@react-native-firebase/crashlytics';

const Payment = ({navigation, route}) => {
  const {res} = route.params;
  // console.log('res',res)
  const [Membermodal, setMembermodal] = useState(false);
  const [loader, setloader] = useState(false);
  const dispatch = useDispatch();
  const [cardDetails, setCardDetails] = useState({});
  const [data, setData] = useState({
    username: '',
    email: '',
    cardno: '',
    cvv: '',
    cardexpire: '',
    refrelcode: '',
  });
  const [dataErr, setDataErr] = useState({
    usernameErr: '',
    emailErr: '',
    cardnoErr: '',
    cvvErr: '',
    cardexpireErr: '',
    refrelcodeErr: '',
  });

  // const _validator = () => {
  //   if (
  //     !data.username &&
  //     !data.email &&
  //     !data.cardno &&
  //     !data.cvv &&
  //     !data.cardexpire
  //   ) {
  //     setDataErr({
  //       ...dataErr,
  //       usernameErr: 'txt',
  //       emailErr: 'txt',
  //       cardnoErr: 'txt',
  //       cvvErr: 'txt',
  //       cardexpireErr: 'txt',
  //     });
  //     return false;
  //   } else if (!data.username) {
  //     setDataErr({...dataErr, usernameErr: 'txt'});
  //     return false;
  //   } else if (!data.email) {
  //     setDataErr({...dataErr, emailErr: 'txt'});
  //     return false;
  //   } else if (!data.cardno) {
  //     setDataErr({...dataErr, cardnoErr: 'txt'});
  //     return false;
  //   } else if (!data.cvv) {
  //     setDataErr({...dataErr, cvvErr: 'txt'});
  //     return false;
  //   } else if (!data.cardexpire) {
  //     setDataErr({...dataErr, cardexpireErr: 'txt'});
  //     return false;
  //   }
  //   return true;
  // };

  // setTimeout(() => {
  //   if (Membermodal) {
  //     setMembermodal(true)
  //   }
  // }, 3000);
  const handleCardChange = card => {
    setCardDetails(card);
  };
  const {createToken} = useStripe();

  const handlePayment = async () => {
    setloader(true);
    try {
      const {token, error} = await createToken({
        type: 'Card',
      });
      if (error) {
        setloader(false);
        // Alert.alert(error.message);
        AndroidToast(error.message);
        console.log('error of the stripe', error);
        // setErrorMessage(error.message);
      } else {
        console.log(token.id); // Token successfully created, handle it accordingly
        AllPostApi({
          url: 'subscription-create',
          Auth: res.userdata.api_token,
          card_cvv: cardDetails.cvv,
          card_expire_month: cardDetails.expiryMonth,
          card_expire_year: cardDetails.expiryYear,
          card_link: '',
          card_no: data.cardno,
          stripe_plan: 'price_1PBEDyRqZ8HuERrGtaC2P2PM',
          // stripe_plan: 'price_1PAncURqZ8HuERrGKLj6NOLM',
          tokenId: token.id,
          slug: 'month',
          referralCode: data.refrelcode,
        }).then(res => {
          setloader(false);
          console.log('subscription Response Data', res);
          if (res.status == 'success') {
            dispatch(setUser(res.userdata));
          } else {
            AndroidToast(res.message);
          }
        });
      }
    } catch (error) {
      console.log('error', error);
      crashlytics().recordError(err);
      setloader(false);
      // setErrorMessage(error.message);
    }
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <Wrapper style={{flex: 1}} behavior="padding">
      <View style={Stylsheet.container}>
        {loader && <Loading />}
        <View
          style={{
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
            style={{marginLeft: 10, position: 'absolute', left: 5}}
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
          </TouchableOpacity>
          <Text style={[Stylsheet.semibldTxt, {textAlign: 'center'}]}>
            {'Payment'}
          </Text>
        </View>
        <ScrollView>
          <View style={{}}>
            <Image
              style={Stylsheet.cardimg}
              source={ImagesCom.paymenticon}
              resizeMode="contain"
            />

            <View style={{}}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Card Holder Name</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {
                      borderColor: dataErr.usernameErr ? 'red' : null,
                      borderWidth: dataErr.usernameErr ? 1 : 0,
                    },
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.user}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter username"
                    placeholderTextColor={Colors.gray}
                    value={res.userdata.username}
                    editable={false}
                    onChangeText={txt => {
                      setData({...data, username: txt});
                      setDataErr({...dataErr, usernameErr: ''});
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center', marginTop: 10}}>
                <Text style={Stylsheet.outtxtinpt}>E-mail</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {
                      borderColor: dataErr.emailErr ? 'red' : null,
                      borderWidth: dataErr.emailErr ? 1 : 0,
                    },
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.mail}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter e-mail"
                    placeholderTextColor={Colors.gray}
                    value={res.userdata.email}
                    editable={false}
                    onChangeText={txt => {
                      setData({...data, email: txt});
                      setDataErr({...dataErr, emailErr: ''});
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center', marginTop: 10}}>
                <Text style={Stylsheet.outtxtinpt}>
                  Referral Code{' '}
                  <Text
                    style={[
                      Stylsheet.outtxtinpt,
                      {
                        fontSize: 10,
                        fontFamily: FontsFmily.Regular,
                        color: '#ccc',
                      },
                    ]}>{`(Optional)`}</Text>
                </Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {
                      borderColor: dataErr.refrelcodeErr ? 'red' : null,
                      borderWidth: dataErr.refrelcodeErr ? 1 : 0,
                    },
                  ]}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.discountcode}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter 7 digit referral code"
                    placeholderTextColor={Colors.gray}
                    value={data.refrelcode}
                    // editable={false}
                    maxLength={7}
                    onChangeText={txt => {
                      setData({...data, refrelcode: txt});
                    }}
                  />
                </View>
              </View>
            </View>
            <Text
              style={[Stylsheet.outtxtinpt, {marginLeft: 25, marginTop: 10}]}>
              Card Fields
            </Text>

            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: 'Card Number',
                postalCode: 'Postal Code',
                cvc: 'CVC',
                expiry: 'MM/YY',
              }}
              onCardChange={handleCardChange}
              cardStyle={{
                textColor: 'black',
                width: wp(85),
                height: 50,
                backgroundColor: Colors.ligtgray,
                marginTop: 5,
                placeholderColor: Colors.gray,
                borderRadius: 10,
              }}
              style={{
                width: wp(85),
                height: 50,
                borderRadius: 10,
                marginTop: 5,
                color: 'red',
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                marginTop: 50,
                paddingBottom: 20,
                marginBottom: Platform.OS === 'ios' ? 55 : 0,
              }}>
              <Button
                title={'Continue'}
                onPress={() => {
                  handlePayment();
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Modalllllllllllllllllllllll */}

        <Modal transparent={true} animationType={'none'} visible={Membermodal}>
          <View style={Stylsheet.modalBackground}>
            <View
              style={[
                Stylsheet.activityIndicatorWrapper,
                {justifyContent: 'center', height: 350},
              ]}>
              <Image
                style={Stylsheet.succsimg}
                source={ImagesCom.succsicon}
                resizeMode="contain"
              />
              <Text
                style={[
                  Stylsheet.b0ldTxt,
                  {textAlign: 'center', fontSize: 18, marginTop: 20},
                ]}>
                Successful!
              </Text>
              <Text style={[Stylsheet.regulrtxt, {textAlign: 'center'}]}>
                Registration Completed
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </Wrapper>
  );
};

export default Payment;

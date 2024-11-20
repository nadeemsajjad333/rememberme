import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Stylsheet from '../constant/Stylsheet';
import Button from '../constant/button';
import {AllPostApi} from './APIscreen';
import {setUser} from '../ReduxToolkit/MyUserSlice';
import {ImagesCom} from '../constant/images';
import {Colors} from '../constant/colors';
import {CardField, CardForm, useStripe} from '@stripe/stripe-react-native';
import {FontsFmily} from '../constant/fonts';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import Loading from './Loading';

const Payment_Public = ({navigation, route}) => {
  const {res} = route.params;
  const {forpublic} = route.params;
  const [cardDetails, setCardDetails] = useState({});
  console.log('forpublic', cardDetails);
  const [loader, setloader] = useState(false);
  const [Membermodal, setMembermodal] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    username: '',
    email: '',
    cardno: '',
    cvv: '',
    cardexpirem: '',
    cardexpirey: '',
  });
  const [dataErr, setDataErr] = useState({
    usernameErr: '',
    emailErr: '',
    cardnoErr: '',
    cvvErr: '',
    cardexpiremErr: '',
    cardexpireyErr: '',
  });

  const _validator = () => {
    if (
      !data.username &&
      !data.email &&
      !data.cardno &&
      !data.cvv &&
      !data.cardexpirem &&
      !data.cardexpirey
    ) {
      setDataErr({
        ...dataErr,
        usernameErr: 'txt',
        emailErr: 'txt',
        cardnoErr: 'txt',
        cvvErr: 'txt',
        cardexpiremErr: 'txt',
        cardexpireyErr: 'txt',
      });
      return false;
    } else if (!data.username) {
      setDataErr({...dataErr, usernameErr: 'txt'});
      return false;
    } else if (!data.email) {
      setDataErr({...dataErr, emailErr: 'txt'});
      return false;
    } else if (!data.cardno) {
      setDataErr({...dataErr, cardnoErr: 'txt'});
      return false;
    } else if (!data.cvv) {
      setDataErr({...dataErr, cvvErr: 'txt'});
      return false;
    } else if (!data.cardexpirem) {
      setDataErr({...dataErr, cardexpiremErr: 'txt'});
      return false;
    } else if (!data.cardexpirey) {
      setDataErr({...dataErr, cardexpireyErr: 'txt'});
      return false;
    }
    return true;
  };

  setTimeout(() => {
    if (Membermodal) {
      navigation.navigate('IndexBottom');
    }
  }, 3000);

  // const Login = async () => {
  //   AllPostApi({url: 'login', email: res.userdata.email, password: '123456@78'})
  //     .then(res => {
  //       setMembermodal(false);
  //       dispatch(setUser(res));
  //       navigation.navigate('IndexBottom');
  //     })
  //     .catch(err => {
  //       console.log('err in login', err);
  //     });
  // };
  const {createToken} = useStripe();

  const subsForPublic = async () => {
    // if (_validator()) {
    const {token, error} = await createToken({
      type: 'Card',
    });
    console
      .log('object', token.id)

      .catch(err => {
        console.log('err in subscription', err);
      });
    // }
  };
  const handleCardChange = card => {
    setCardDetails(card);
    console.log('card data', card);
  };

  const handlePayment = async () => {
    setloader(true);
    try {
      const {token, error} = await createToken({
        type: 'Card',
      });

      if (error) {
        console.log('error in if', error);
        // setErrorMessage(error.message);
      } else {
        console.log(token.id); // Token successfully created, handle it accordingly
        AllPostApi({
          url: 'subscription-create',
          Auth: res.userdata.api_token,
          card_cvv: cardDetails.cvv,
          card_expire_month: cardDetails.expire_month,
          card_expire_year: cardDetails.expire_year,
          card_link: '',
          card_no: cardDetails.number,
          stripe_plan: 'price_1PBEDyRqZ8HuERrGtaC2P2PM',
          tokenId: token.id,
          slug: 'month',
        })
          .then(res => {
            console.log('subscription Response Data', JSON.stringify(res));
            setloader(false);
            if (res.status == 'success') {
              dispatch(setUser(res.userdata));
              setMembermodal(true);
            }
          })
          .catch(err => {
            console.log('error in api', err);
            setloader(false);
          });
      }
    } catch (error) {
      console.log('error in tryis catch', error);
      setloader(false);
      // setErrorMessage(error.message);
    }
  };

  // Your component's return/render logic here
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {loader && <Loading />}
        <ScrollView>
          <View style={{}}>
            <View style={[Stylsheet.flexHead, {marginTop: 20}]}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
              </TouchableOpacity>
              <Text style={Stylsheet.semibldTxt}>Payment</Text>
              <Text style={Stylsheet.semibldTxt}>{''}</Text>
            </View>

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
            </View>
            {/* <View style={{alignSelf: 'center', marginTop: 10}}>
              <Text style={Stylsheet.outtxtinpt}>Card No</Text>
              <View
                style={[
                  Stylsheet.textinptBox,
                  {
                    borderColor: dataErr.cardnoErr ? 'red' : null,
                    borderWidth: dataErr.cardnoErr ? 1 : 0,
                  },
                ]}>
                <Image
                  style={Stylsheet.inputicon}
                  source={ImagesCom.card}
                  resizeMode="contain"
                />

                <TextInput
                  style={Stylsheet.TextInputS}
                  placeholder="Enter Card No"
                  placeholderTextColor={Colors.gray}
                  value={data.cardno}
                  keyboardType='number-pad'
                  maxLength={16}
                  editable={true}
                  onChangeText={txt => {
                    setData({...data, cardno: txt});
                    setDataErr({...dataErr, cardnoErr: ''});
                  }}
                />
              </View>
            </View>
           
            <View style={{flexDirection:"row",width:"85%",justifyContent:"space-between",alignSelf:"center", alignItems:"center"}}>
            <View style={{alignSelf: 'center',width:widthPercentageToDP(40), marginTop: 10}}>
              <Text style={Stylsheet.outtxtinpt}>Card Expiry Month</Text>
              <View
                style={[
                  Stylsheet.textinptBox,
                  {
                  width:widthPercentageToDP(40),

                    borderColor: dataErr.cardexpiremErr ? 'red' : null,
                    borderWidth: dataErr.cardexpiremErr ? 1 : 0,
                  },
                ]}>
                <Image
                  style={Stylsheet.inputicon}
                  source={ImagesCom.event}
                  resizeMode="contain"
                />

                <TextInput
                  style={Stylsheet.TextInputS}
                  placeholder="03"
                  placeholderTextColor={Colors.gray}
                  value={data.cardexpirem}
                  maxLength={2}
                  keyboardType='number-pad'
                  editable={true}
                  onChangeText={txt => {
                    setData({...data, cardexpirem: txt});
                    setDataErr({...dataErr, cardexpiremErr: ''});
                  }}
                />
              </View>
            </View>
            <View style={{ width:widthPercentageToDP(40), marginTop: 10}}>
              <Text style={Stylsheet.outtxtinpt}>Card Expiry Year</Text>
              <View
                style={[
                  Stylsheet.textinptBox,
                  {
                    width:widthPercentageToDP(40),
                    borderColor: dataErr.cardexpireyErr ? 'red' : null,
                    borderWidth: dataErr.cardexpireyErr ? 1 : 0,
                   
                  },
                ]}>
                <Image
                  style={Stylsheet.inputicon}
                  source={ImagesCom.event}
                  resizeMode="contain"
                />

                <TextInput
                  style={[Stylsheet.TextInputS,{width:100}]}
                  placeholder="23"
                  placeholderTextColor={Colors.gray}
                  keyboardType='number-pad'
                  value={data.cardexpirey}
                  maxLength={2}
                  editable={true}
                  onChangeText={txt => {
                    setData({...data, cardexpirey: txt});
                    setDataErr({...dataErr, cardexpireyErr: ''});
                  }}
                />
              </View>
            </View>
           
            </View>
            
            <View style={{alignSelf: 'center',marginTop:10,  width:widthPercentageToDP(40),}}>
              <Text style={Stylsheet.outtxtinpt}>CVC</Text>
              <View
                style={[
                  Stylsheet.textinptBox,
                  {
                    width:widthPercentageToDP(40),
                    borderColor: dataErr.cvvErr ? 'red' : null,
                    borderWidth: dataErr.cvvErr ? 1 : 0,
                  },
                ]}>
                <Image
                  style={Stylsheet.inputicon}
                  source={ImagesCom.card}
                  resizeMode="contain"
                />

                <TextInput
                  style={Stylsheet.TextInputS}
                  placeholder="Enter CVC"
                  placeholderTextColor={Colors.gray}
                  keyboardType='number-pad'
                  value={data.cvv}
                  maxLength={3}
                  editable={true}
                  onChangeText={txt => {
                    setData({...data, cvv: txt});
                    setDataErr({...dataErr, cvvErr: ''});
                  }}
                />
              </View>
            </View> */}
            <Text
              style={[Stylsheet.outtxtinpt, {marginLeft: 25, marginTop: 10}]}>
              Card No
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
                borderRadius: 8,
                marginTop: 5,
                placeholderColor: Colors.gray,
              }}
              style={{
                width: wp(85),
                height: 50,
                backgroundColor: Colors.ligtgray,
                borderRadius: 10,
                marginTop: 5,
                color: 'red',
                borderWidth: 0.5,
                borderColor: Colors.gray,
                alignSelf: 'center',
              }}
            />

            <View style={{marginTop: 50, paddingBottom: 20}}>
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

export default Payment_Public;

{
  /* <View style={{alignSelf: 'center',marginTop:10}}>
<Text style={Stylsheet.outtxtinpt}>Card Number</Text>
<View
  style={[
    Stylsheet.textinptBox,
    {
      borderColor: dataErr.cardnoErr ? 'red' : null,
      borderWidth: dataErr.cardnoErr ? 1 : 0,
    },
  ]}>
  <Image
    style={Stylsheet.inputicon}
    source={ImagesCom.card}
    resizeMode="contain"
  />

  <TextInput
    style={Stylsheet.TextInputS}
    placeholder="Enter Card Number"
    placeholderTextColor={Colors.gray}
    value={data.cardno}
    keyboardType="numeric"
    maxLength={16}
    onChangeText={txt => {
      setData({...data, cardno: txt});
      setDataErr({...dataErr, cardnoErr: ''});
    }}
  />
</View>
</View>

<View
style={[
  Stylsheet.flexdirec,
  {justifyContent: 'space-between', marginHorizontal: 30,marginTop:10},
]}>
<View style={{alignSelf: 'center'}}>
  <Text style={Stylsheet.outtxtinpt2}>Expiry Month</Text>
  <View
    style={[
      Stylsheet.textinptBox,
      {
        borderColor: dataErr.cardexpiremErr ? 'red' : null,
        borderWidth: dataErr.cardexpiremErr ? 1 : 0,
        width: wp(40),
      },
    ]}>
    <TextInput
      style={Stylsheet.TextInputS}
      placeholder="MM"
      placeholderTextColor={Colors.gray}
      value={data.cardexpirem}
      keyboardType="numeric"
      maxLength={2}
      onChangeText={txt => {
        setData({...data, cardexpirem: txt});
        setDataErr({...dataErr, cardexpiremErr: ''});
      }}
    />
  </View>
</View>

<View style={{alignSelf: 'center'}}>
  <Text style={Stylsheet.outtxtinpt2}>Expiry Year</Text>
  <View
    style={[
      Stylsheet.textinptBox,
      {
        borderColor: dataErr.cardexpireyErr ? 'red' : null,
        borderWidth: dataErr.cardexpireyErr ? 1 : 0,
        width: wp(40),
      },
    ]}>
    <TextInput
      style={Stylsheet.TextInputS}
      placeholder="YYYY"
      placeholderTextColor={Colors.gray}
      value={data.cardexpirey}
      keyboardType="numeric"
      maxLength={4}
      onChangeText={txt => {
        setData({...data, cardexpirey: txt});
        setDataErr({...dataErr, cardexpireyErr: ''});
      }}
    />
  </View>
</View>
</View>


<View style={{marginLeft:30,marginTop:10}}>
  <Text style={Stylsheet.outtxtinpt2}>CVC</Text>
  <View
    style={[
      Stylsheet.textinptBox,
      {
        borderColor: dataErr.cvvErr ? 'red' : null,
        borderWidth: dataErr.cvvErr ? 1 : 0,
        width: wp(40),
      },
    ]}>
    <TextInput
      style={Stylsheet.TextInputS}
      placeholder="123"
      placeholderTextColor={Colors.gray}
      value={data.cvv}
      keyboardType="numeric"
      maxLength={4}
      onChangeText={txt => {
        setData({...data, cvv: txt});
        setDataErr({...dataErr, cvvErr: ''});
      }}
    />
  </View>
</View> */
}

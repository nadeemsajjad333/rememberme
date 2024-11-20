import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
} from 'react-native';

import React, { useState } from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ImagesCom } from '../../constant/images';
import Button from '../../constant/button';
import { FontsFmily } from '../../constant/fonts';
import { useSelector } from 'react-redux';

const Subscription = ({ navigation, route }) => {
  const { res } = route.params;
  const [Membermodal, setMembermodal] = useState(false);

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
          onPress={() => setMembermodal(true)}>
          <AntDesign name="arrowleft" size={22} style={{ color: '#000' }} />
        </TouchableOpacity>
        <Text style={[Stylsheet.semibldTxt, { textAlign: 'center' }]}>{'Subscription'}</Text>
      </View>
      <View style={{}}>
        

        <Image
          style={Stylsheet.subscrimg}
          source={ImagesCom.subscrIcon}
          resizeMode="contain"
        />

        <Text
          style={[
            Stylsheet.regulrtxt,
            { textAlign: 'center', marginTop: 40, fontFamily: FontsFmily.Medium },
          ]}>
          Create unlimited Actions, stored securely in{'\n'}the could and synced
          to your devices.
        </Text>

        <ImageBackground
          style={Stylsheet.dollrimg}
          source={ImagesCom.monthly}
          borderRadius={10}
          resizeMode="cover">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 15,
            }}>
            <Text style={Stylsheet.dollrtxt}>Monthly</Text>
            <Text style={Stylsheet.dollrtxt}>
              $2.99/
              <Text
                style={[Stylsheet.dollrtxt, { fontFamily: FontsFmily.Regular }]}>
                month
              </Text>
            </Text>
          </View>
        </ImageBackground>

        <View style={{ marginTop: 50 }}>
          <Button
            title={'Subscribe'}
            onPress={() => navigation.navigate('Payment', { res })}
          />
        </View>
      </View>

      {/* Modalllllllllllllllllllllll */}

      <Modal transparent={true} animationType={'none'} visible={Membermodal}>
        <View style={Stylsheet.modalBackground}>
          <View style={Stylsheet.activityIndicatorWrapper}>
            <Image
              style={Stylsheet.MemIconimg}
              source={ImagesCom.membicon}
              resizeMode="contain"
            />
            <Text style={[Stylsheet.regulrtxt, { textAlign: 'center' }]}>
              Select and continue as you are new member{'\n'}or already have a
              membership
            </Text>
            <View
              style={{
                height: 120,
                justifyContent: 'space-between',
                marginTop: 30,
              }}>
              <Button
                title={'New Member'}
                onPress={() => {
                  setMembermodal(false);
                }}
              />

              <TouchableOpacity
                onPress={() => {navigation.navigate('IndexBottom')}}
                style={Stylsheet.logwithBtn}>
                <Text style={[Stylsheet.b0ldTxt, { paddingLeft: 10 }]}>
                  Already have membership
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Subscription;

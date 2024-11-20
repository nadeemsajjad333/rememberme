import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, { useState } from 'react';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import Button from '../../constant/button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UpdatePopop from '../../component/UpdatePopop';

const Started = ({navigation}) => {

  return (
    <View style={[Stylsheet.container, {alignItems: 'center'}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', paddingBottom: 20}}>
          <Text style={[Stylsheet.semibldTxt, {marginTop: 40}]}>
            Let's you in
          </Text>

          <Image
            style={Stylsheet.startIcn}
            source={ImagesCom.start}
            resizeMode="contain"
          />
          {/* <View
            style={{
              marginTop: 20,
              height: 180,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity style={Stylsheet.logwithBtn}>
              <View style={Stylsheet.buttonCentr}>
                <Ionicons
                  name="logo-facebook"
                  size={24}
                  style={{color: 'blue'}}
                />

                <Text style={[Stylsheet.b0ldTxt, {paddingLeft: 10}]}>
                  Continue with Facebook
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={Stylsheet.logwithBtn}>
              <View style={Stylsheet.buttonCentr}>
                <Image
                  style={Stylsheet.withbtnicn}
                  source={ImagesCom.gmail}
                  resizeMode="contain"
                />
                <Text style={[Stylsheet.b0ldTxt, {paddingLeft: 10}]}>
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={Stylsheet.logwithBtn}>
              <View style={Stylsheet.buttonCentr}>
                <AntDesign name="apple1" size={22} style={{color: '#000'}} />
                <Text style={[Stylsheet.b0ldTxt, {}]}>Continue with Apple</Text>
              </View>
            </TouchableOpacity>
          </View> */}

          <View style={{marginTop: 120}}>
            <Button
              title={'Get Started'}
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Started;

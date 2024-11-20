import { View, Text ,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import MoVideoPlayer from 'react-native-mo-video-player';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Stylsheet from '../../constant/Stylsheet';



const VideoPlayer = ({navigation,route}) => {

const {Data} =route.params
const {retunData} =route.params

  return (
    <View style={{flex:1,}} >
      {Data.map((item)=>{
        return(
          <MoVideoPlayer 
          style={{width:wp(100), height:hp(100)}}
          source={{uri:item.file}}
          encodeURI={{uri:item.file}}
          poster={item.thumbnail}
          autoPlay={true}
          playInBackground={false}
          showHeader={true}
          showSeeking10SecondsButton={true}
          showCoverButton={false}
          showFullScreenButton={true}
          showSettingButton={false}
          showMuteButton={true}
          
          
          
        />
        )
      })}
   
            <TouchableOpacity 
            style={Stylsheet.videoBack}
            onPress={() => navigation.navigate('VideoDetails',{Detail:retunData})}>
              <AntDesign name="arrowleft" size={16} style={{color: '#FFFFFF'}} />
            </TouchableOpacity>
    </View>

  )
}

export default VideoPlayer
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Image,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Stylsheet from '../../constant/Stylsheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {ImagesCom} from '../../constant/images';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FontsFmily} from '../../constant/fonts';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';
import {
  recieverMsg,
  recieverVoice,
  senderMsg,
  senderVoice,
} from '../../component/SendRecivemsg';
import moment from 'moment';
import {RegisterApi, audioConvert} from '../../component/APIscreen';
import ImagePicker from 'react-native-image-crop-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioComp from '../../component/AudioComp';
import Indicator from '../../component/Indicator';
import Sound from 'react-native-sound';
import Progress_Bar from '../../component/Progress_Bar';

const audioRecorderPlayer = new AudioRecorderPlayer();

const Chat = ({navigation, route}) => {
  const {item} = route.params;
  const user = useSelector(state => state.user.user);
  const currentDateTime = new Date();
  const dateTimeString = currentDateTime.toLocaleString();
  const [micTF, setmicTF] = useState(false);

  const [Membermodal, setMembermodal] = useState(false);
  const [loader, setloader] = useState(false);
  const [imgviewmodal, setImgviewmodal] = useState(false);
  const [chatImgView, setChatImgView] = useState(false);
  const [chatImg, setChatImg] = useState('');
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState('');
  const [replymsg, setreplymsg] = useState({});
  const [img, setimg] = useState('');
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [location, setLocation] = useState('');
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [recordingState, setRecordingState] = useState('');
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);
  const [progress, setProgress] = useState(0);

  console.log('timer', recordingState);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      return;
    });
    console.log('audio object result', result);
  };
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    console.log('audio path on audio record stop', result);
    goForFetch(result);
    setTimer(null);
  };

  useEffect(() => {
    if (recordingState === 'recording') {
      timerInterval.current = setInterval(() => {
        setTimer(timer + 1);
      }, 500);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        if (recordingState === 'uploading') setTimer(0);
      }
    };
  }, [timer, recordingState]);

  useEffect(() => {
    checkPermission();
  }, []);
  const checkPermission = async () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    let result;
    try {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'App needs access to your microphone so you can search with voice.',
        },
      );
    } catch (error) {}
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const goForFetch = async voice => {
    setloader(true);
    console.log('voice Link', voice);
    const data1 = new FormData();
    data1.append('image', {
      uri: Platform.OS === 'android' ? 'file://' + voice : voice,
      name: `${Date.now()}test.aac`,
      type: 'audio/aac',
    });
    audioConvert({url: 'update-image'}, data1)
      .then(res => {
        console.log('audio convert back res', res);
        if (res.status == 'success') {
          setloader(false);
          setRecordingState('');
          handleSendVoice(res.file);
        }
      })
      .catch(err => {
        console.log('audio convert back err', err);
        setloader(false);
      });
  };

  const selectimg = () => {
    setloader(true);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const data = new FormData();
      data.append('image', {
        uri: image.path,
        type: 'image/jpeg',
        name: 'image' + new Date() + '.jpg',
      });
      RegisterApi({url: 'update-image'}, data)
        .then(res => {
          console.log('Image..........', res);
          if (res.status == 'success') {
            setloader(false);
            setMessage(res.file);
            setImgviewmodal(true);
          }
        })
        .catch(error => {
          console.log('Error Meaasge', error.response);
          setloader(false);
        });
    });
  };

  const selectCamImg = () => {
    setloader(true);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    }).then(image => {
      const data = new FormData();
      data.append('image', {
        uri: image.path,
        type: 'image/jpeg',
        name: 'image' + new Date() + '.jpg',
      });
      RegisterApi({url: 'update-image'}, data)
        .then(res => {
          if (res.status == 'success') {
            setloader(false);
            setMessage(res.file);
            setImgviewmodal(true);
          }
        })
        .catch(error => {
          console.log('Error Meaasge', error.response);
          setloader(false);
        });
    });
  };

  const guestData = {
    username: item.username,
    email: item.email,
    image: item.image,
    id: item.id,
  };
  const userData2 = {
    username: user.userdata.username,
    email: user.userdata.email,
    image: user.userdata.image,
    id: user.userdata.id,
  };

  useEffect(() => {
    _getMeesages();
    _updateChatCount();
  }, []);

  const _chatUsers = async voiceMessageUrl => {
    try {
      database()
        .ref('users/' + user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .set({
          latestMessage: message,
          timestamp: database.ServerValue.TIMESTAMP,
          counter: 0,
          user: guestData,
          voiceMessage: voiceMessageUrl,
        });

      database()
        .ref('users/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .once('value', snapshot => {
          const counts = snapshot?.val()?.counter;
          database()
            .ref('users/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
            .child(user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
            .set({
              latestMessage: message,
              timestamp: database.ServerValue.TIMESTAMP,
              counter: counts ? counts + 1 : 1,
              user: userData2,
            });
        });
    } catch (error) {
      console.log('error in crate chat', error);
    }
  };

  const _updateChatCount = async () => {
    try {
      database()
        .ref('users/' + user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))

        .once('value', snapshot => {
          if (snapshot.val() != null) {
            database()
              .ref('users/' + user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
              .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
              .update({
                counter: 0,
              });
          }
        });
    } catch (error) {}
  };

  const _getMeesages = async () => {
    try {
      database()
        .ref('messeges')
        .child(user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .on('value', dataSnapshot => {
          let msgs = [];
          dataSnapshot.forEach(child => {
            msgs.push({
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              date: child.val().messege.date,
              audio: child.val().messege.audio,
            });
            return undefined;
          });
          setMessages(msgs.reverse());
        });
    } catch (error) {}
  };

  const handleSend = () => {
    setMessage('');
    if (message) {
      senderMsg(
        message,
        user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        Date.now(),
      );
      _chatUsers();

      recieverMsg(
        message,
        user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        Date.now(),
      );
      _chatUsers();
    }
  };

  const handleSendVoice = voice => {
    console.log('voice going for firebase', voice);
    senderVoice(
      voice,
      user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
    );

    _chatUsers()
      .then(() => {})
      .catch(err => {});

    recieverVoice(
      voice,
      user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
    );
    _chatUsers()
      .then(() => {})
      .catch(err => {});
  };

  const playsound = () => {
    var sound = new Sound('sms.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          sound.getDuration() +
          'number of channels: ' +
          sound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
          onStartRecord();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  return (
    <View style={Stylsheet.container}>
      {loader && <Indicator />}
      <View style={Stylsheet.chatlist2}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={22}
            style={{color: '#000', marginLeft: 10}}
          />
        </TouchableOpacity>
        <Image
          style={{width: 35, height: 35, borderRadius: 30, marginLeft: 10}}
          source={{uri: item.image}}
          resizeMode="contain"
        />
        <Text style={[Stylsheet.semibldTxt, {marginLeft: 7}]}>
          {item.username}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          inverted
          data={messages}
          renderItem={({item, index}) => {
            return (
              <>
                {item.recievedBy ==
                user.userdata?.email.replace(/[^a-zA-Z0-9 ]/g, '') ? (
                  item?.msg?.slice(-4) == '.jpg' ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          setChatImgView(true), setChatImg(item.msg);
                        }}
                        style={Stylsheet.imgBack}>
                        <Image
                          style={{width: 150, height: 200, borderRadius: 10}}
                          source={{uri: item.msg}}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      <Text style={Stylsheet.chatTimeR}></Text>
                    </View>
                  ) : item?.audio ? (
                    <View>
                      <View style={{left: 5}}>
                        <AudioComp
                          audioUri={item.audio}
                          recive={item.recievedBy}
                        />
                      </View>

                      <Text style={[Stylsheet.chatTimeL, {top: 4}]}>
                        {moment(item.date).format('hh:mm A')}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View style={Stylsheet.chatItemLft}>
                        <Text
                          style={[
                            Stylsheet.sender,
                            {textAlign: 'left', paddingLeft: 5},
                          ]}>
                          {item.msg}
                        </Text>
                      </View>
                      <Text style={Stylsheet.chatTimeL}>
                        {moment(item.date).format('hh:mm A')}
                      </Text>
                    </View>
                  )
                ) : null}

                {item.sendBy ==
                user.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '') ? (
                  item?.msg?.slice(-4) == '.jpg' ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          setChatImgView(true), setChatImg(item.msg);
                        }}
                        style={Stylsheet.imgBackR}>
                        <Image
                          source={{uri: item.msg}}
                          resizeMode="cover"
                          style={{width: 150, height: 200, borderRadius: 10}}
                        />
                      </TouchableOpacity>

                      <Text style={[Stylsheet.chatTimeR, {}]}>
                        {moment(item.date).format('hh:mm A')}
                      </Text>
                    </View>
                  ) : item?.audio ? (
                    <View>
                      <View style={{alignSelf: 'flex-end', right: 5}}>
                        <AudioComp audioUri={item.audio} />
                      </View>

                      <Text style={[Stylsheet.chatTimeR, {top: 4}]}>
                        {moment(item.date).format('hh:mm A')}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={[
                          Stylsheet.chatItem,
                          {backgroundColor: '#FCCCCE'},
                        ]}>
                        <Text style={[Stylsheet.sender, {textAlign: 'right'}]}>
                          {item.msg}
                        </Text>
                      </View>
                      <Text style={Stylsheet.chatTimeR}>
                        {moment(item.date).format('hh:mm A')}
                      </Text>
                    </View>
                  )
                ) : null}
              </>
            );
          }}
        />
        <View
          style={[
            Stylsheet.flexdirec,
            {
              justifyContent: 'space-around',
            },
          ]}>
          <View style={Stylsheet.chatSendBox}>
            {recordingState == 'uploadings' || recordingState == '' ? (
              <TextInput
                style={{
                  width: 220,
                  left: 20,
                  color: '#000',
                  fontFamily: FontsFmily.Regular,
                }}
                placeholder="Message"
                placeholderTextColor={'#ADADAD'}
                multiline={true}
                value={message}
                onChangeText={setMessage}
              />
            ) : null}
            {recordingState == 'recording' ? (
              <View style={[Stylsheet.flexdirec, {width: 220, left: 20}]}>
                <FontAwesome
                  name="microphone"
                  size={20}
                  style={{
                    color: '#D92835',
                    opacity: recordingState === 'recording' ? timer % 2 : 1,
                  }}
                />
                <Text style={{color: 'red', left: 10}}>
                  {Math.floor(timer / 60)}:
                  {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                selectimg(), setMembermodal(false);
              }}
              style={{}}>
              <View style={Stylsheet.circle}>
                <AntDesign name="picture" size={20} style={{color: '#000'}} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                selectCamImg(), setMembermodal(false);
              }}
              style={{right: 5}}>
              <View style={Stylsheet.circle}>
                <FontAwesome name="camera" size={20} style={{color: '#000'}} />
              </View>
            </TouchableOpacity>
          </View>
          {message.length ? (
            <TouchableOpacity onPress={handleSend} style={Stylsheet.sendarrow}>
              <Ionicons name="send" size={20} style={{color: '#FFFFFF'}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onLongPress={() => {
                playsound();
                setRecordingState('recording');
              }}
              onPressOut={() => {
                if (recordingState === 'recording') {
                  onStopRecord();
                  setRecordingState('uploadings');
                }
              }}
              style={Stylsheet.sendarrow}>
              <FontAwesome
                name="microphone"
                size={20}
                style={{color: '#FFFFFF'}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modalllllllllllllllllllllll */}

      {/* ///////////////////////////// gallery image view modal */}

      <Modal transparent={true} animationType={'none'} visible={imgviewmodal}>
        <View
          activeOpacity={1}
          onPress={() => setImgviewmodal(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(4, 4, 4,0.7)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <ImageBackground
              style={{
                flex: 1,
                // width: wp(100),
                // height: hp(100),
                borderRadius: 10,
                justifyContent: 'space-between',
              }}
              source={{
                uri: message,
              }}
              resizeMode="cover"
              borderRadius={10}>
              <View
                style={{
                  backgroundColor: 'rgba(4, 4, 4,0.7)',
                  width: wp(100),
                  height: hp(6),
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setImgviewmodal(false), setMessage('');
                  }}
                  style={{left: 12}}>
                  <AntDesign
                    name="closecircle"
                    size={25}
                    style={{color: '#fff'}}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: 'rgba(4, 4, 4,0.7)',
                  width: wp(100),
                  height: hp(6),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{borderRadius: 10, backgroundColor: 'pink', left: 5}}>
                  <Text style={{color: '#000', padding: 10}}>
                    {guestData.username}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleSend(), setMessage(''), setImgviewmodal(false);
                  }}
                  style={Stylsheet.sendarrow2}>
                  <Ionicons name="send" size={20} style={{color: '#FFFFFF'}} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>
      </Modal>

      {/* /////////////////////////////chat image view Modal */}

      <Modal transparent={true} animationType={'none'} visible={chatImgView}>
        <View
          activeOpacity={1}
          onPress={() => setChatImgView(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(4, 4, 4,0.7)',
            // alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              setChatImgView(false);
            }}
            style={{
              left: 12,
              backgroundColor: '#C83037',
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 7,
              top: 15,
            }}>
            <AntDesign name="arrowleft" size={22} style={{color: '#fff'}} />
          </TouchableOpacity>
          <View>
            <Image
              style={{
                width: 350,
                height: 500,
                borderRadius: 10,
                alignSelf: 'center',
              }}
              source={{
                uri: chatImg,
              }}
              resizeMode="cover"
            />
          </View>
          <Text>{'    '}</Text>
        </View>
      </Modal>
    </View>
  );
};

export default Chat;

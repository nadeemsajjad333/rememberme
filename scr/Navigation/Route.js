import React, { Fragment, useEffect, useRef ,useState} from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import VersionCheck from 'react-native-version-check';
import Started from '../Screens/authScreens/Started';
import SplashHome from '../Screens/OtherScreens/SplashHome';
import SplashScreen from '../Screens/authScreens/SplashScreen';
import SignUp from '../Screens/authScreens/SignUp';
import Term_Cndtn from '../Screens/authScreens/Term_Cndtn';
import Login from '../Screens/authScreens/Login';
import ForgotPswrd from '../Screens/authScreens/ForgotPswrd';
import PinVerify from '../Screens/authScreens/PinVerify';
import NewPassword from '../Screens/authScreens/NewPassword';
import Subscription from '../Screens/authScreens/Subscription';
import Payment from '../Screens/authScreens/Payment';
import Dijit from '../Screens/authScreens/Dijit';
import IndexBottom from '../bottomTab/IndexBottom';
import UserMedia from '../Screens/OtherScreens/UserMedia';
import Payment_Public from '../component/Payment_Public';
import UserPhotos from '../Screens/OtherScreens/UserPhotos';
import UserPhotoDetail from '../Screens/OtherScreens/UserPhotoDeatil';
import UserVideos from '../Screens/OtherScreens/UserVideos';
import UserVDetail from '../Screens/OtherScreens/UserVDetail';
import UserDoc from '../Screens/OtherScreens/UserDoc';
import AddNew from '../Screens/OtherScreens/AddNew';
import ChatList from '../Screens/OtherScreens/ChatList';
import EditProfile from '../Screens/OtherScreens/EditProfile';
import ChangePass from '../Screens/OtherScreens/ChangePass';
import CreateEvent from '../Screens/OtherScreens/CreateEvent';
import Templates from '../Screens/OtherScreens/Templates';
import Notification from '../Screens/OtherScreens/Notification';
import MediaDetail from '../Screens/OtherScreens/MediaDetail';
import PhotoMedia from '../Screens/OtherScreens/PhotoMedia';
import ViewPDF from '../Screens/OtherScreens/ViewPDF';
import VideoMedia from '../Screens/OtherScreens/VideoMedia';
import DocumentMedia from '../Screens/OtherScreens/DocumentMedia';
import PhotoDetails from '../Screens/OtherScreens/PhotoDetails';
import VideoDetails from '../Screens/OtherScreens/VideoDetails';
import Calender from '../Screens/OtherScreens/Calender';
import JoinedPeople from '../Screens/OtherScreens/referrel_by/JoinedPeople';
import WithDraw from '../Screens/OtherScreens/referrel_by/WithDraw';
import History from '../Screens/OtherScreens/referrel_by/History';
import VideoPlayer from '../Screens/OtherScreens/VideoPlayer';
import VideoPlayerUsr from '../Screens/OtherScreens/VideoPlayerUsr';
import UpdatePopop from '../component/UpdatePopop';

const Stack = createNativeStackNavigator();

const Roote = () => {
  const navigationRef = useNavigationContainerRef();
  const [update, setupdate] = useState(false)

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('focus', () => {
      VersionCheck.needUpdate().then(async res => {
        console.log('res',res)
        if (res.currentVersion < res.latestVersion) {
          setupdate(true)
          // Handle the update logic here, e.g., set a state or show a modal
        }
      });
    });

    return unsubscribe;
  }, [navigationRef]);

  const user = useSelector(state => state.user.user);

  return (
    <NavigationContainer ref={navigationRef}>
      {update && <UpdatePopop close={()=>setupdate(false)}/>}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user === null ? (
          <Fragment>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Started" component={Started} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Term_Cndtn" component={Term_Cndtn} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPswrd" component={ForgotPswrd} />
            <Stack.Screen name="PinVerify" component={PinVerify} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
            <Stack.Screen name="Subscription" component={Subscription} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Dijit" component={Dijit} />
          </Fragment>
        ) : (
          <Fragment>
            <Stack.Screen name="SplashHome" component={SplashHome} />
            <Stack.Screen name="IndexBottom" component={IndexBottom} />
            <Stack.Screen name="UserMedia" component={UserMedia} />
            <Stack.Screen name="Payment_Public" component={Payment_Public} />
            <Stack.Screen name="UserPhotos" component={UserPhotos} />
            <Stack.Screen name="UserPhotoDetail" component={UserPhotoDetail} />
            <Stack.Screen name="UserVideos" component={UserVideos} />
            <Stack.Screen name="UserVDetail" component={UserVDetail} />

            <Stack.Screen name="UserDoc" component={UserDoc} />
            <Stack.Screen name="AddNew" component={AddNew} />
            <Stack.Screen name="ChatList" component={ChatList} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChangePass" component={ChangePass} />
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
            <Stack.Screen name="Templates" component={Templates} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="MediaDetail" component={MediaDetail} />
            <Stack.Screen name="PhotoMedia" component={PhotoMedia} />
            <Stack.Screen name="VideoMedia" component={VideoMedia} />
            <Stack.Screen name="ViewPDF" component={ViewPDF} />
            <Stack.Screen name="DocumentMedia" component={DocumentMedia} />
            <Stack.Screen name="PhotoDetails" component={PhotoDetails} />
            <Stack.Screen name="VideoDetails" component={VideoDetails} options={{ orientation: "portrait" }} />
            <Stack.Screen name="Calender" component={Calender} />
            <Stack.Screen name="JoinedPeople" component={JoinedPeople} />
            <Stack.Screen name="WithDraw" component={WithDraw} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
            <Stack.Screen name="VideoPlayerUsr" component={VideoPlayerUsr} />
          </Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Roote;

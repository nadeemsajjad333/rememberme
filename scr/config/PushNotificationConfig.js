import PushNotification from 'react-native-push-notification';
import {navigate, push} from './NavigationService';



const PushNotificationsConfigs = {
  congigurations: () => {


    PushNotification.configure({
      onNotification: notification => {
        console.log('NOOOOOOOOOOOOOOOOOOOOOOOOOOO', notification);

     

        if (notification.userInteraction) {
          // navigate("VenderNotification");

        
            navigate('Notification');
       
        }
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onRegistrationError: err => {},
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false,
    });
  },
};
export default PushNotificationsConfigs;

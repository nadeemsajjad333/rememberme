import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import Route from './scr/Navigation/Route';
import {Provider} from 'react-redux';
import Mystore from './scr/ReduxToolkit/MyStore';
import {PersistGate} from 'reduxjs-toolkit-persist/integration/react';
import {persistStore} from 'reduxjs-toolkit-persist';
import {StripeProvider} from '@stripe/stripe-react-native';
import VersionCheck from 'react-native-version-check';
import {useNavigationContainerRef} from '@react-navigation/native';
let persistor = persistStore(Mystore);
// Stripe Publis Live Key: pk_live_51P7KbXRqZ8HuERrG4qsToxkarXrpGhDMPrfOaea5jNTP05ky1GPbUjr330oB51Q8SlxuEI8G1hSyC7dVY7xXDAIq005Mq7s00i
// Stripe Publis Test Key: pk_test_51P7KbXRqZ8HuERrGwvUEWeFnxLxc02qB3ICwGMtkuivK6jdinHNKNxdgKkjjCpY71U6OrwRicvB3euilvqrmhagO00OivVtcc4
const App = () => {
  return (
    <StripeProvider publishableKey="pk_live_51P7KbXRqZ8HuERrG4qsToxkarXrpGhDMPrfOaea5jNTP05ky1GPbUjr330oB51Q8SlxuEI8G1hSyC7dVY7xXDAIq005Mq7s00i">
      <SafeAreaView style={{flex: 1}}>
        <Provider store={Mystore}>
          <PersistGate persistor={persistor}>
            <Route />
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </StripeProvider>
  );
};

export default App;

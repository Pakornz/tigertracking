import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert,
  Button
} from 'react-native';
import firebase from 'react-native-firebase';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import NotificationPopup from 'react-native-push-notification-popup';


class App extends Component {

async componentDidMount() {
  this.checkPermission();
  this.createNotificationListeners(); //add this line
}

////////////////////// Add these methods //////////////////////
  
  //Remove listeners allocated in createNotificationListeners()
componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            console.log('fcmToken-add-token',fcmToken);
            
        }else{
          console.log('fcmToken-maidai',fcmToken);
          console.log('gggggggggggggggggggggggggggggggggggggggggggggg');
          
        }
    }else{
      console.log('fcmToken-mee-law',fcmToken);
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    }
  }
  
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      // this.showSimpleMessage(title, body);
      this.popup.show({
        onPress: function() {console.log('Pressed')},
        appIconSource: require('./assets/icon-TLD.png'),
        appTitle: 'TigerTracking',
        timeText: 'Now',
        title: title,
        body: body,
        slideOutTime: 5000
      });
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     const { title, body } = notificationOpen.notification;
  //     this.showSimpleMessage(title, body);
  // });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  // const notificationOpen = await firebase.notifications().getInitialNotification();
  // if (notificationOpen) {
  //     const { title, body } = notificationOpen.notification;
  //     this.showSimpleMessage(title, body);
  // }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showSimpleMessage(title, body) {
  const message = {
    message: title,
    description: body,
    icon: { icon: "info", position: "left" },
    type: "info",
    floating: true,
    duration: 3000,
    // backgroundColor: "blue", // background color
    // color: "#606060", // text color
  };
  
  showMessage(message);
}

render() {
  return (
    <View style={styles.container}>
        <NotificationPopup ref={ref => this.popup = ref} />

        <FlashMessage position="top" />


      <Text style={styles.welcome}>
        Welcome to React Native!
      </Text>
      <Text style={styles.instructions}>
        To get started, edit App.js
      </Text>

    </View>
  );
}

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  demoButton: {
    alignSelf: "auto",
    marginBottom: 9,
    marginHorizontal: 5,
  },
});
 
export default class TestApp extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <App name="C" />
      </View>
    );
  }
}
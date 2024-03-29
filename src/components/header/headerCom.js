import React, { Component } from 'react';
import { StatusBar, Image, StyleSheet, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, View, Left, Body, Right, Header, Title, Drawer, Container } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Img from './../../assets/new-logo-TLD.png';
import SideBar from '../drawer/sidebar/index';
import IconBadge from 'react-native-icon-badge';
import firebase from 'react-native-firebase';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import NotificationPopup from 'react-native-push-notification-popup';
import axios from "axios";
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import badgeCountReducer from '../../reducers/badgeCountReducer';
import { decreaseBadge } from './../../actions/index';
import PushNotification from 'react-native-push-notification'
import NotifService from './NotifyService';


class headerCom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // dataResponeToken: dataResponeToken,
      BadgeCount: null,

      buttonBack: this.props.buttonBack,

      senderId: ""
    }


    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));

    // Text.defaultProps.allowFontScaling = false;
  }

  async componentDidMount() {
    // this.checkPermission();
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({ senderId: fcmToken })

    this.createNotificationListeners(); //add this line

  }

  // ////////////////////// Add these methods //////////////////////

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    // this.notificationOpenedListener();
  }

  createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      // this.showSimpleMessage(title, body);
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1', title);

      // this.popup.show({
      //   onPress: function () { console.log('Pressed') },
      //   appIconSource: require('./../../assets/icon-TLD.png'),
      //   appTitle: 'TigerTracking',
      //   timeText: 'Now',
      //   title: title,
      //   body: body,
      //   slideOutTime: 3000
      // });

      // const localNotification = () => {
      //   PushNotification.localNotification({
      //     autoCancel: true,
      //     largeIcon: "ic_launcher",
      //     smallIcon: "ic_notification",
      //     bigText: body,
      //     // subText: "This is a subText",
      //     color: "green",
      //     vibrate: true,
      //     vibration: 300,
      //     title: title,
      //     message: "Notification Message",
      //     playSound: true,
      //     soundName: 'default',
      //   });
      // };

      this.notif.localNotif(title, body)

      // localNotification();

    });

    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log('55555555555555555555555', message);

      console.log(JSON.stringify(message));
    });
  }

  // showSimpleMessage(title, body) {
  //   const message = {
  //     message: title,
  //     description: body,
  //     icon: { icon: "info", position: "left" },
  //     type: "info",
  //     floating: true,
  //     duration: 3000,
  //     // backgroundColor: "blue", // background color
  //     // color: "#606060", // text color
  //   };

  //   showMessage(message);
  // }

  onRegister = (token) => {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif = (notif) => {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  render() {
    // const storeCount = createStore(badgeCountReducer);
    // console.log(`ddddddddddddsfsdfdsdddddddddddddddddd = ${storeCount.getState()}`);

    var buttonMenu

    if (this.state.buttonBack == 1) {
      buttonMenu =
        <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }}
          transparent
          onPress={() => this.props.navigation.pop()}>
          <Icon3 name="ios-arrow-back" size={wp('6%')} color='#778899' />
        </TouchableOpacity>
    } else {
      buttonMenu =
        <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }}
          transparent
          onPress={() => this.props.navigation.openDrawer()}>
          <Icon2 name="menu" size={wp('6%')} color='#778899' />
        </TouchableOpacity>
    }


    return (
      <View>

        <Header style={{ backgroundColor: '#fcfcfc', flexDirection: 'row' }}>

          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fcfcfc" translucent={false} />

          <Left style={{ flex: 1 }}>
            {buttonMenu}
          </Left>
          <Body style={{ flex: 2, alignItems: 'center' }}>
            <Image source={Img} style={styles.logo} />
          </Body>
          <Right>
            <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }}
              transparent
              onPress={() => this.props.navigation.navigate('NotifyScreen')} >
              <IconBadge
                MainElement={
                  <View>

                    <Icon2 name="notifications" size={wp('7%')} color='#778899' />

                  </View>
                }
                BadgeElement={
                  <Text style={{ color: '#FFFFFF', fontSize: hp('1.5%') }}>{this.props.badgeCount}</Text>
                }

                IconBadgeStyle={
                  {
                    width: wp('1%'),
                    height: hp('2%'),
                    backgroundColor: "red"
                  }
                }
                Hidden={this.props.badgeCount == 0 || this.props.badgeCount == null}
              />
            </TouchableOpacity>
          </Right>
        </Header>

        {/* <NotificationPopup ref={ref => this.popup = ref} /> */}
        {/* <FlashMessage position="top" /> */}

      </View>
    )
  }
}
mapStateToProps = (state) => {
  return {
    badgeCount: state.badgeCount,
  };
}

matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ decreaseBadge: decreaseBadge }, dispatch)
}

export default withNavigation(connect(mapStateToProps, matchDispatchToProps)(headerCom))

const styles = StyleSheet.create({
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: wp('40%'),
    height: hp('20%'),
    resizeMode: 'contain',
  },
});
import React from 'react';
import axios from "axios";
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, TextInput, StyleSheet, Animated, Dimensions, StatusBar, Keyboard, NetInfo } from 'react-native';
import { AsyncStorage, Image, ImageBackground } from 'react-native';
import ImgBgSplash from '../../assets/bg-pai.png';
import { domain, notify_jobstatus } from '../../config/configApp'
import firebase from 'react-native-firebase';
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import badgeCountReducer from '../../reducers/badgeCountReducer';
import { setBadge } from '../../actions/index';


// const resetAction = StackActions.reset({
//   index: 1,
//   actions: [
//     NavigationActions.navigate({ routeName: 'DrawerHomeScreen' }),
//     NavigationActions.navigate({ routeName: 'DrawerAddressShowScreen' }),
//   ],
// });

class SplashScreen extends React.Component {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0.5);
    this.animatedValue2 = new Animated.Value(0);

    this.state = {
      loading: true,
      isRefreshing: false,
      isConnected: true,
      token: "",
      phones: "",

      dataResponeToken: dataResponeToken,
      resCheckToken: resCheckToken,

      dataMessageList: dataMessageList,
    }

    AsyncStorage.getItem('token', (err, result) => {
      this.setState({ token: result })
      console.log('####pagesplash-token####', this.state.token);
    });

    AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pagesplash-phone####', this.state.phones);
    });

    console.disableYellowBox = true
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  }

  componentWillMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);

    // this.notificationListener();
    // this.notificationOpenedListener();
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  performTimeConsumingTask = async () => {

    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 4,
      delay: 2000
    }).start();

    Animated.timing(this.animatedValue2, {
      toValue: 1,
      delay: 200,
      duration: 2000
    }).start();

    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2500
      )
    )
  }

  callApiBadgeCount(mobilephone) {
    axios({
      method: 'get',
      url: `${domain}/notification/messagenotifylist/${notify_jobstatus}/${mobilephone}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataMessageList = res.data
        this.setState({ loading: false, dataMessageList: dataMessageList })

        const daataa = this.state.dataMessageList.data.message_nofity
        const datares = daataa.filter(a => {
          return a.read_message_status == 'N'
        })
        const resCount = datares.length
        this.props.setBadge(resCount)

      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
        // alert(error)
        console.log(error)
      });
  }

  callApiCheckToken(token) {
    console.log('********************', token)
    axios({
      method: 'post',
      url: `${domain}/authen/checktoken`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        adminSecretKey: `TDL123`,
      }
    })
      .then(res => {
        console.log('********************', true)
        const resCheckToken = res.data
        this.setState({
          resCheckToken: resCheckToken,
        })
        console.log('########SplashCheckToken########', this.state.resCheckToken.message)
        this.checkPermission();
        this.callApiBadgeCount(this.state.phones)
        // this.createNotificationListeners(); //add this line

        this.props.navigation.navigate('DrawerHomeScreen')
      })
      .catch(error => {
        console.log('********************', false)
        const err = JSON.parse(error.request._response)
        console.log(err)
        console.log('########SplashCheckToken########', err)
        this.props.navigation.navigate('LoginScreen')
      });
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.callApiCheckToken(this.state.token)
    }

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
        console.log('fcmToken-add-token', fcmToken);
        this.callApiUpdateTokenMessage(this.state.phones, fcmToken)
      } else {
        console.log('fcmToken-maidai', fcmToken);
        console.log('gggggggggggggggggggggggggggggggggggggggggggggg');
      }
    } else {
      console.log('fcmToken-mee-law', fcmToken);
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
      this.callApiUpdateTokenMessage(this.state.phones, fcmToken)
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

  // async createNotificationListeners() {
  //   /*
  //   * Triggered when a particular notification has been received in foreground
  //   * */
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     // this.showSimpleMessage(title, body);
  //     this.popup.show({
  //       onPress: function () { console.log('Pressed') },
  //       appIconSource: require('./../../assets/icon-TLD.png'),
  //       appTitle: 'TigerTracking',
  //       timeText: 'Now',
  //       title: title,
  //       body: body,
  //       slideOutTime: 5000
  //     });
  //   });

  //   /*
  //   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  //   * */
  //   // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //   //     const { title, body } = notificationOpen.notification;
  //   //     this.showSimpleMessage(title, body);
  //   // });

  //   /*
  //   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  //   * */
  //   // const notificationOpen = await firebase.notifications().getInitialNotification();
  //   // if (notificationOpen) {
  //   //     const { title, body } = notificationOpen.notification;
  //   //     this.showSimpleMessage(title, body);
  //   // }
  //   /*
  //   * Triggered for data only payload in foreground
  //   * */
  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     //process data message
  //     console.log(JSON.stringify(message));
  //   });
  // }

  callApiUpdateTokenMessage = (mobile, tokenID) => {
    axios({
      method: 'post',
      url: `${domain}/notification/updatetokenmessage`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        user_id: `${mobile}`,
        token_message: `${tokenID}`
      }
    })
      .then(res => {
        const dataResponeToken = res.data
        this.setState({ loading: false, dataResponeToken: dataResponeToken, spinner: false })
        console.log(this.state.dataResponeToken.message);

      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
        // alert(error)
        console.log(error)
      });
  }

  handleUnhandledTouches() {
    Keyboard.dismiss
    return false;
  }

  render() {

    const truckStyle = {
      transform: [{ scale: this.animatedValue }]
    };

    const scaleText = {
      transform: [{ scale: this.animatedValue2 }]
    };

    let checkNetShow
    if (!this.state.isConnected) {
      checkNetShow =
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    } else {
      checkNetShow = null
    }


    var CurrentYear = new Date().getFullYear();

    return (
      <ImageBackground source={ImgBgSplash} style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff', resizeMode: 'contain' }}>
        <View style={styles.screen} onStartShouldSetResponder={this.handleUnhandledTouches}>
          <StatusBar barStyle="dark-content" hidden={true} translucent={false} />

          <View style={styles.container}>

            {checkNetShow}

            <View style={{ marginTop: hp('30%') }}>
              <Animated.View style={[styles.ring, truckStyle]}>
                <Animated.Image
                  source={require("../../assets/new-logo-TLD.png")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: wp('60%'),
                      height: hp('30%')
                    }
                  ]}
                />
              </Animated.View>
            </View>

            <Animated.View
              style={[
                {
                  position: "absolute",
                  bottom: wp('5%'),
                  width: width / 1.5,
                  height: hp('0.5%'),
                  backgroundColor: "#f57f20", //f57f20
                  borderRadius: 2
                },
                scaleText
              ]}
            />


          </View>

          {/* <View style={styles.footer}>
        <Text style={styles.footerText}>©:{CurrentYear} Tiger Distribution & Logistics Company Limited.</Text>
        </View> */}

        </View>
      </ImageBackground>
    );
  }
}

mapStateToProps = (state) => {
  return {
    badgeCount: state.badgeCount,
  };
}

matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ setBadge: setBadge }, dispatch)
}

export default withNavigation(connect(mapStateToProps, matchDispatchToProps)(SplashScreen))


const resCheckToken = {
  "result": "",
  "status": "",
  "message": ""
}

const dataResponeToken = {
  "result": "",
  "status": "",
  "message": ""
}

const dataMessageList = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "message_nofity": [
      {
        "job_no": "",
        "seq_no": "",
        "job_status": "",
        "message_id": "",
        "message_title": "",
        "message_body": "",
        "send_message_status": "",
        "send_message_date": "",
        "read_message_status": "",
        "read_message_date": "",
        "active_status": "",
        "create_date": "",
        "update_date": ""
      }
    ]
  }
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: hp('30%')
    // backgroundColor: "#23527c"
  },
  ring: {
    backgroundColor: "transparent",
    borderRadius: 150,
    borderWidth: wp('0.75'),
    borderColor: "transparent",
    padding: wp('2%')
  },
  footer: {
    justifyContent: 'flex-end',
    // backgroundColor: '#23527c',
  },
  footerText: {
    padding: wp('3.5%'),
    color: '#fff',
    fontSize: hp('1.8%'),
    textAlign: 'center',
  },
  offlineContainer: {
    backgroundColor: '#b52424', //b52424
    height: hp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 0
  },
  offlineText: {
    color: '#fff',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
});


import React from "react";
import axios from "axios";
import AwesomeAlert from 'react-native-awesome-alerts';
import Modal from "react-native-modal";
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { StatusBar, StyleSheet, View, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import { Text, Header, Left, Body, Right, Form, Button, Picker, Input, Footer } from 'native-base';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import Icon6 from 'react-native-vector-icons/Ionicons';
import Img from '../../assets/new-logo-TLD.png';
import Imgwarning from '../../assets/exclamation-mark.png';
import ImgMap from '../../assets/google.png'
import { AsyncStorage } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Animated, Marker, ProviderPropType, Callout } from 'react-native-maps';
import RNPickerSelect from 'react-native-picker-select';
import { domain, domainHis } from '../../config/configApp'

// const resetAction = StackActions.reset({
//   index: 1,
//   actions: [
//     NavigationActions.navigate({ routeName: 'DrawerHomeScreen' }),
//     NavigationActions.navigate({ routeName: 'DrawerAddressShowScreen' }),
//   ],
// });

class AddressInsertSubmitScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      isRefreshing: false,
      phones: "",
      selected2: undefined,
      showResults: false,
      visibleModal: null,
      dataPassBack: this.props.navigation.state.params.passBack,

      resGenAddress: resGenAddress,
      resZipCode: resZipCode,

      llat: '',
      llng: '',

      name: this.props.navigation.state.params.passBack.name,
      mobilephone: this.props.navigation.state.params.passBack.mobilephone,
      address: this.props.navigation.state.params.passBack.address,
      subdistrict: this.props.navigation.state.params.passBack.subdistrict,
      district: this.props.navigation.state.params.passBack.district,
      province: this.props.navigation.state.params.passBack.province,
      zipcode: this.props.navigation.state.params.passBack.zipcode,
      latitude: this.props.navigation.state.params.passBack.latlat,
      longitude: this.props.navigation.state.params.passBack.lnglng,

      region: {
        latitude: this.props.navigation.state.params.passBack.latlat,
        longitude: this.props.navigation.state.params.passBack.lnglng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },

      coordinate: {
        latitude: this.props.navigation.state.params.passBack.latlat,
        longitude: this.props.navigation.state.params.passBack.lnglng,
      },

    }

  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageAddressInsert', this.state.phones);
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    return true;  // Do nothing when back button is pressed
  }

  callApiGenAddress(phones) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'post',
      url: `${domain}/shipping/addshippingaddress`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        user_id: `${phones}`,
        receiver_name: `${this.state.name}`,
        receiver_phone: `${this.state.mobilephone}`,
        address: `${this.state.address} ${this.state.subdistrict} ${this.state.district} ${this.state.province} ${this.state.zipcode}`,
        subdistrict: `${this.state.subdistrict}`,
        district: `${this.state.district}`,
        province: `${this.state.province}`,
        zipcode: `${this.state.zipcode}`,
        latitude: `${this.state.latitude}`,
        longitude: `${this.state.longitude}`,
      }
    })
      .then(res => {
        const resGenAddress = res.data
        this.setState({
          resGenAddress: resGenAddress,
        })
        console.log('########Address########', this.state.resGenAddress.message)

        this.props.navigation.push('DrawerAddressShowScreen')
        this.loadingButton.showLoading(false);
      })
      .catch(error => {
        console.log(error)
        // const err = JSON.parse(error.request._response)
        this.loadingButton.showLoading(false);
      });
  }


  onButtonCreateAddress = async (phones) => {
    this.callApiGenAddress(phones)

  }

  render() {

    return (
      <View style={styles.screen}>

        <Header style={{ backgroundColor: '#fcfcfc', flexDirection: 'row' }}>

          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fcfcfc" translucent={false} />

          <Left style={{ flex: 1 }}>
            <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }} transparent onPress={() => this.props.navigation.navigate('DrawerAddressShowScreen')}>
              <Icon6 name="ios-arrow-back" size={wp('7%')} color='#778899' />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 2, alignItems: 'center' }}>
            <Image source={Img} style={styles.logo} />
          </Body>
          <Right>
            <TouchableOpacity style={{ paddingLeft: wp('2%'), paddingVertical: hp('1.5%') }} transparent onPress={() => this.props.navigation.navigate('AddressInsertScreen')}>
              <Icon5 name="edit" size={wp('6%')} color='#778899' />
            </TouchableOpacity>
          </Right>
        </Header>

        <View style={styles.box}>
          <Text style={styles.title}>ยืนยันเพิ่มที่อยู่จัดส่ง</Text>
        </View>

        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('3.5%') }}>

          <View style={styles.container}>

            <View style={styles.inputContainer}>
              <Icon5 name='person' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.name}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon4 name='mobile1' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.mobilephone}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon1 name='home' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.address}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon3 name='address' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.zipcode}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon5 name='edit-location' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.province}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon5 name='edit-location' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.district}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon5 name='edit-location' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs}>{this.state.subdistrict}</Text>
            </View>

            <MapView
              provider={MapView.PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={this.state.region}
            >
              <Marker
                coordinate={this.state.coordinate}
                title={`${this.state.address}`}
                description={`${this.state.subdistrict} ${this.state.district} ${this.state.province} ${this.state.zipcode}`} >
              </Marker>
            </MapView>

            {/* <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
                onPress={() => this.onButtonCreateAddress(
                  this.state.phones
                )}>
                <Text style={styles.loginText}>ยืนยันเพิ่มที่อยู่จัดส่ง</Text>
            </TouchableOpacity> */}

            <View style={{ marginTop: hp('2.5%'), marginBottom: hp('3.5%') }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('60%')}
                height={hp('6%')}
                title="ยืนยันเพิ่มที่อยู่จัดส่ง"
                titleFontSize={hp('2.2%')}
                titleColor='#fff'
                backgroundColor="#23527c"
                borderRadius={30}
                onPress={() => this.onButtonCreateAddress(this.state.phones)}
              />
            </View>


          </View>

        </KeyboardAwareScrollView>

      </View>
    );
  }
}

export default withNavigation(AddressInsertSubmitScreen)

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0100;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const resZipCode = {
  "result": "",
  "status": "",
  "data": {
    "post_code": "",
    "province_id": "",
    "province_name": "",
    "districts": [
      {
        "district_id": "",
        "district_name": "",
        "subdistricts": [
          {
            "id": "",
            "name": "",
            "latitude": "",
            "longitude": ""
          }
        ]
      }
    ]
  }
}

const resGenAddress = {
  "result": "",
  "status": "",
  "message": ""
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    marginLeft: wp('2%'),
    fontSize: hp('2%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: hp('1%'),
    borderWidth: 0,
    borderColor: '#fff',
    borderRadius: 8,
    color: 'black',
    paddingRight: wp('7.5%'), // to ensure the text is never behind the icon
    width: wp('60%'),
    height: hp('6%'),
  },
  inputAndroid: {
    marginLeft: wp('3%'),
    fontSize: hp('2%'),
    paddingHorizontal: hp('1.5%'),
    paddingVertical: hp('1%'),
    borderWidth: 0,
    borderColor: '#fff',
    borderRadius: 8,
    color: 'black',
    paddingRight: wp('7.5%'), // to ensure the text is never behind the icon
    width: wp('60%'),
    height: hp('6%'),
    flex: 1,
  },
});

const styles = StyleSheet.create({
  map: {
    position: "relative",
    width: wp('70%'),
    height: hp('30%'),
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: wp('40%'),
    height: hp('20%'),
    resizeMode: 'contain',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    marginVertical: hp('2.5%'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: wp('0.25%'),
    width: wp('75%'),
    height: hp('6%'),
    marginBottom: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    width: wp('60%'),
    marginLeft: wp('4%'),
    color: '#000',
    flex: 1,
    fontSize: hp('2%')
  },
  inputIcon: {
    width: wp('7.5%'),
    height: hp('3.75'),
    marginLeft: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    width: wp('60%'),
    borderRadius: 30,
    marginBottom: hp('3.5'),
  },
  buttonContainer2: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    width: wp('75%'),
    borderRadius: 30,
    marginBottom: hp('3.5'),
  },
  loginButton: {
    backgroundColor: "#23527c",
  },
  loginButton2: {
    backgroundColor: "#fff",
  },
  loginText: {
    color: 'white',
  },
  loginText2: {
    color: '#707070',
    fontSize: hp('2.2')
  },
  mapContainer: {
    margin: wp('5%'),
    flexDirection: 'column',
    alignItems: 'center',
  },
  mapImg: {
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
    width: wp('60%'),
    height: hp('12.5%'),
    resizeMode: 'contain',
    flexDirection: 'column',
    alignItems: 'center',
  },
  picker: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: wp('0.25%'),
    width: wp('75%'),
    marginBottom: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /////////////////////modals///////////////////////
  popup: {
    backgroundColor: 'white',
    marginHorizontal: wp('5%'),
    borderRadius: 10,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    justifyContent: 'center'
  },
  popupContent: {
    //alignItems: 'center',
    margin: ('2%'),
    height: hp('30%'),
  },
  popupButtons: {
    paddingVertical: hp('1%'),
    borderTopWidth: hp('0.5%'),
    borderColor: "#eee",
    borderRadius: 10,
    alignItems: 'center'
  },
  btnClose: {
    borderRadius: 10,
    height: hp('5%'),
    width: wp('20%'),
    backgroundColor: '#ffbc33',
    padding: wp('2%'),
    margin: wp('2%'),
  },
  txtClose: {
    textAlign: 'center',
    color: "#FFFFFF",
    fontSize: hp('2%'),
  },
  modalInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  position: {
    textAlign: 'center',
    fontSize: hp('2.2%'),
    color: "#999999",
    fontFamily: 'kanit',
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
    marginTop: hp('1.5%')
  },
  position1: {
    color: "#999999",
    fontFamily: 'kanit',
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  Imgwarning: {
    width: wp('17.5%'),
    height: hp('8.75%'),
    resizeMode: 'contain',
  },
  //////////////////////////box/////////////////
  imageUser: {
    width: wp('26%'),
    height: hp('13%'),
    resizeMode: 'contain',
    marginLeft: wp('4%'),
  },
  box: {
    padding: wp('3%'),
    paddingLeft: wp('5%'),
    backgroundColor: '#fcfcfc',
    flexDirection: 'row',
    borderBottomWidth: wp('0.75%'),
    borderBottomColor: '#d8d8d8',
    backgroundColor: '#23527c'
  },
  boxContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2.5%'),
  },
  title: {
    fontSize: hp('2.5%'),
    color: "#fff", //474747
  },
  description: {
    fontSize: hp('2%'),
    color: "#646464",
  },
});
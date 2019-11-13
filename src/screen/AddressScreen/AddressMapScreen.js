import React from "react";
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Animated, Marker, ProviderPropType, Callout } from 'react-native-maps';
import { StatusBar, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Keyboard, BackHandler } from "react-native";
import { Container, Header, Title, Left, Right, Button, Body, Content, Text, Footer, FooterTab, Tab, Tabs, TabHeading, View, Fab, Icon } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from 'react-native-geocoding';
import { AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class AddressMapScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      address: this.props.navigation.state.params.dataMap,

      region: {
        latitude: this.props.navigation.state.params.dataMap.latitude,
        longitude: this.props.navigation.state.params.dataMap.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: null,

      poi: null,

      coordinate: {
        latitude: this.props.navigation.state.params.dataMap.latitude,
        longitude: this.props.navigation.state.params.dataMap.longitude,
      },

      latlat: this.props.navigation.state.params.dataMap.latitude,
      lnglng: this.props.navigation.state.params.dataMap.longitude,

      showButton: false,

    };

    this.onPoiClick = this.onPoiClick.bind(this);
    console.disableYellowBox = true
    console.log('####pageAddressMap', this.state.address);

  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    return true;  // Do nothing when back button is pressed
  }

  onPoiClick(e) {
    const poi = e.nativeEvent;

    this.setState({
      poi,
      latlat: poi.coordinate.latitude,
      lnglng: poi.coordinate.longitude,
      showButton: true
    });
  }

  handleUnhandledTouches() {
    Keyboard.dismiss
    return false;
  }

  // componentDidMount = async() => {
  //   await this.getData(this.state.address) //Method for API call
  // }

  // getData(address) {
  //   Geocoder.setApiKey('AIzaSyDQLkhf_XP9r2Gd8AUUWqXghzsqwpQzv48')

  //   Geocoder.getFromLocation(`${address.subdistrict} ${address.district} ${address.province} ${address.zipcode}`)
  // 	.then(json => {
  //     var location = json.results[0].geometry.location;
  //     // alert(location.lat + `,` + location.lng);

  //     this.setState({
  //       region: {
  //         latitude: location.lat,
  //         longitude: location.lng,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       },
  //       coordinate:{
  //         latitude: location.lat,
  //         longitude: location.lng,
  //       }

  //     })
  // 	})
  // 	.catch(error => console.warn(error));

  // }

  onButtonSubmitMap = () => {
    this.loadingButton.showLoading(true);
    // AsyncStorage.removeItem('latlat')
    // AsyncStorage.removeItem('lnglng')
    // AsyncStorage.setItem('latlat',`${this.state.latlat}`)
    // AsyncStorage.setItem('lnglng',`${this.state.lnglng}`)

    const passBack = {
      checkcheck: true,
      name: this.state.address.name,
      mobilephone: this.state.address.mobilephone,
      address: this.state.address.address,
      subdistrict: this.state.address.subdistrict,
      district: this.state.address.district,
      province: this.state.address.province,
      zipcode: this.state.address.zipcode,
      latlat: this.state.latlat,
      lnglng: this.state.lnglng,
    }

    this.props.navigation.navigate('AddressInsertSubmitScreen', { passBack: passBack })
    this.loadingButton.showLoading(false);
  }

  render() {

    let latlng

    if (!this.state.poi) {
      var lat = `${this.state.coordinate.latitude}`
      var lng = `${this.state.coordinate.longitude}`
      var llat = `${lat.substring(0, 8)}`
      var llng = `${lng.substring(0, 8)}`

      latlng =
        <View style={styles.buttonContainer2}>
          <TouchableOpacity
            style={styles.bubble}>
            <Text style={{ fontSize: hp('2%'), color: '#5b5b5b' }}>Latitude  : {llat}</Text>
            <Text style={{ fontSize: hp('2%'), color: '#5b5b5b' }}>Longitude : {llng}</Text>
          </TouchableOpacity>
        </View>
    } else {
      var lat = `${this.state.poi.coordinate.latitude}`
      var lng = `${this.state.poi.coordinate.longitude}`
      var llat = `${lat.substring(0, 8)}`
      var llng = `${lng.substring(0, 8)}`

      latlng =
        <View style={styles.buttonContainer2}>
          <TouchableOpacity
            style={styles.bubble}>
            <Text style={{ fontSize: hp('2%'), color: '#5b5b5b' }}>Latitude  : {llat}</Text>
            <Text style={{ fontSize: hp('2%'), color: '#5b5b5b' }}>Longitude : {llng}</Text>
          </TouchableOpacity>
        </View>

    }

    let buttonSubmit =
      <View style={[styles.buttonContainer3, { paddingHorizontal: wp('4.5%'), paddingVertical: hp('1.5%'), }]}>
        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={wp('60%')}
          height={hp('6%')}
          title="กดปุ่มเพื่อยืนยันตำแหน่ง"
          titleFontSize={hp('2.2%')}
          titleColor='white'
          backgroundColor="#23527c"
          borderRadius={20}
          onPress={() => this.onButtonSubmitMap()}
        />
      </View>

    let mark
    if (!this.state.poi) {
      mark = <Marker
        coordinate={this.state.coordinate}
        title={`${this.state.address.address}`}
        description={`${this.state.address.subdistrict} ${this.state.address.district} ${this.state.address.province} ${this.state.address.zipcode}`} >
      </Marker>
    } else {
      {
        this.state.poi && (
          mark = <Marker
            coordinate={this.state.poi.coordinate}
            title={`${this.state.address.address}`}
            description={`${this.state.address.subdistrict} ${this.state.address.district} ${this.state.address.province} ${this.state.address.zipcode}`} >
          </Marker>
        )
      }
    }

    return (
      <View style={styles.container} onStartShouldSetResponder={this.handleUnhandledTouches}>

        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this.onPoiClick}
        >

          {mark}

        </MapView>


        <View style={{ flex: 1, justifyContent: 'flex-start', alignSelf: 'flex-start', marginHorizontal: wp('5%') }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.bubble} onPress={() => this.props.navigation.pop()}>
              <Icon4 name="keyboard-backspace" style={{ fontSize: hp('3.5%'), color: '#5b5b5b' }} />
            </TouchableOpacity>
          </View>
        </View>

        {latlng}
        {buttonSubmit}



        {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={ () => 
            {
            AsyncStorage.removeItem('latlat')
            AsyncStorage.removeItem('lnglng')
            }
          }
          style={styles.bubble}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View> */}

      </View>
    );
  }
}

export default withNavigation(AddressMapScreen)

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// function randomColor() {
//   return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }

AddressMapScreen.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'white', //rgba(255,255,255,0.7) //3db39e
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 20,
  },
  bubble2: {
    backgroundColor: '#23527c', //rgba(255,255,255,0.7) //3db39e
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 20,
  },
  button: {
    width: wp('20%'),
    paddingHorizontal: wp('3%'),
    alignItems: 'center',
    marginHorizontal: wp('2.5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: hp('2.5%'),
    backgroundColor: 'transparent',
  },
  buttonContainer2: {
    flexDirection: 'row',
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  buttonContainer3: {
    flexDirection: 'row',
    marginTop: hp('2.5%'),
    marginBottom: hp('7.5%'),
    backgroundColor: 'transparent',
  },
});

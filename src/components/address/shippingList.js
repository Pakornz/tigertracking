import React from "react";
import axios from "axios";
import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from "react-native-modal";
import {
  Image, StyleSheet, View, FlatList, ActivityIndicator, RefreshControl,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
} from "react-native";
import { Fab, Icon, Text, Tab, Tabs, ScrollableTab, TabHeading } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImgLocation from "./../../assets/address.png";
import ImgLocation2 from "./../../assets/address2.png";
import ImgChecked from './../../assets/checked.png';
import ImgBin from './../../assets/trash.png';
import ImgFav from './../../assets/lace.png';
import ImgMap from './../../assets/google.png';
import ImgQrcode from './../../assets/blackberry-qr-code-variant.png';
import ImgBarcode from './../../assets/barcode.png';
import Imgerror from './../../assets/error.png';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage } from 'react-native';
import { domain, isIphoneX } from '../../config/configApp'
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Animated, Marker, ProviderPropType, Callout } from 'react-native-maps';
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert'
import { SwipeListView } from 'react-native-swipe-list-view';

class shippingList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      phones: "",
      show: false,
      spinner: false,

      dataShippingList: dataShippingList,
      dataShipping: dataShipping,
      dataDeleteShipping: dataDeleteShipping,

      dataDefault: dataDefault,

      visibleModal: null,
      userSelected: [],

      testlog: '',

      itemSelect: null,

      foundParcel: false,

      region: {
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },

      coordinate: {
        latitude: 0.0,
        longitude: 0.0,
      },

      gg: null,

    }

    // Text.defaultProps.allowFontScaling = false;

  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageAddress', this.state.phones);
    });
    this.callApiShippingList(this.state.phones) //Method for API call
  }

  // shouldComponentUpdate(nextProp, nextState) {
  //   console.log('shouldComponentUpdate called.');
  //   return false;
  // }

  callApiShippingList(phones) {
    axios({
      method: 'get',
      url: `${domain}/shipping/shippingaddresslist/${phones}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataShippingList = res.data
        this.setState({ loading: false, dataShippingList: dataShippingList, foundParcel: true })
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong' })
        // alert(error)
        // console.log(error)
      });
  }

  callApiShipping = async (phones, userSelected) => {
    await axios({
      method: 'get',
      url: `${domain}/shipping/shippingaddress/${phones}/${userSelected.receiver_id}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataShipping = res.data
        this.setState({ loading: false, dataShipping: dataShipping, gg: dataShipping.data.shipping.receiver_id })
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong' })
        // alert(error)
        // console.log(error)
      });
  }

  callApiSelect(item, phones) {
    axios({
      method: 'post',
      url: `${domain}/shipping/defaultshippingaddress`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        user_id: `${phones}`,
        receiver_id: item.receiver_id
      }
    })
      .then(res => {
        const dataDefault = res.data
        this.setState({ dataDefault: dataDefault })
        console.log('################', this.state.dataDefault.message)
        this.onRefresh(phones)
      })
      .catch(error => {
        this.setState({ error: 'Something just went wrong' })
        // alert('Select')
        // console.log(error)
      });
  }

  callApiDeleteShipping(itemSelect, phones) {
    this.setState({ spinner: true })
    axios({
      method: 'delete',
      url: `${domain}/shipping/deleteshippingaddress`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        user_id: `${phones}`,
        receiver_id: itemSelect.receiver_id
      }
    })
      .then(res => {
        const dataDeleteShipping = res.data
        this.setState({ dataDeleteShipping: dataDeleteShipping, spinner: false })
        console.log("delete", this.state.dataDeleteShipping.message)
        this.onRefresh(phones)
      })
      .catch(error => {
        this.setState({ show: false, spinner: false })
        this.setState({ visibleModal: 0 })
        // alert(error)
        // console.log(error)
      });

  }

  onRefresh(phones) {
    // this.setState({ isRefreshing: true })
    axios({
      method: 'get',
      url: `${domain}/shipping/shippingaddresslist/${phones}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataShippingList = res.data
        this.setState({ show: false, isRefreshing: false, dataShippingList: dataShippingList })
      })
      .catch(error => {
        this.setState({ show: false, isRefreshing: false, error: 'Something just went wrong' })
        // alert('refesh')
        // console.log(error)
      });
    console.log('###########', 'onRefresh')
  }

  onButtonSelect = (item) => {
    this.callApiSelect(item, this.state.phones)
  }

  onButtonSubmitDelete = (itemSelect) => {
    this.callApiDeleteShipping(itemSelect, this.state.phones)

  }

  onButtonShowMap = async (item) => {

    const lat = Number(item.latitude)
    const lng = Number(item.longitude)

    await this.setState({
      region: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },

      coordinate: {
        latitude: lat,
        longitude: lng,
      },
    })

    this.setState({ visibleModal: 99 })
  }

  clickEventListener(item) {
    this.setState({ userSelected: item }, () => {
      this.callApiShipping(this.state.phones, this.state.userSelected)
      this.setState({ visibleModal: 1 })
    });
  }

  onNext = () => {
    const passBack = {
      checkcheck: false,
    }
    this.props.navigation.navigate('AddressInsertScreen', { passBack: passBack })
  }

  handleClose = () => {
    this.setState({ show: false })
  }


  renderModalContentShippingAddress = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>

          <View style={{ flex: 1, flexDirection: 'row', padding: wp('5%'), alignItems: 'center', justifyContent: 'flex-start' }}>
            <Image style={styles.image} source={ImgLocation} />
            <View style={{ flex: 1, flexDirection: 'column', marginLeft: wp('7%'), marginRight: 0, justifyContent: 'center' }}>
              <Text style={styles.position}>{this.state.dataShipping.data.shipping.receiver_id}</Text>
              <View style={styles.span}></View>
              <Text style={styles.position}>{this.state.dataShipping.data.shipping.name}</Text>
              <Text style={styles.position}>{this.state.dataShipping.data.shipping.phone}</Text>
              <Text style={styles.position}>{this.state.dataShipping.data.shipping.address}</Text>
            </View>
          </View>

          <Tabs>
            <Tab heading={
              <TabHeading>
                <Image style={{ resizeMode: "contain", width: wp('8%'), height: hp('8%'), marginTop: 0, tintColor: '#a4abb2' }} source={ImgQrcode} />
                <Text>Qrcode</Text>
              </TabHeading>}>
              <View style={{ marginVertical: hp('3%'), alignItems: 'center' }}>
                <QRCode
                  value={this.state.dataShipping.data.shipping.receiver_id}
                  size={wp('40%')}
                  bgColor='black'
                  fgColor='#fcfcfc' />
              </View>
            </Tab>
            <Tab heading={
              <TabHeading>
                <Image style={{ resizeMode: "contain", width: wp('8%'), height: hp('8%'), marginTop: 0, tintColor: '#a4abb2' }} source={ImgBarcode} />
                <Text>Barcode</Text>
              </TabHeading>}>
              <View style={{ marginVertical: hp('3%') }}>
                <Barcode
                  value={this.state.gg}
                  format="CODE128"
                  width={wp('0.4%')}
                  height={hp('18%')}
                  background='#fcfcfc' />
              </View>
            </Tab>
          </Tabs>

        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  renderModalContentShowMap = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={this.state.region}
          >
            <Marker
              coordinate={this.state.coordinate}
              title={`${this.state.dataShipping.data.shipping.name}`}
              description={`${this.state.dataShipping.data.shipping.address}`} >
            </Marker>
          </MapView>

        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  renderModalContentDelete = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent2}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgerror} source={Imgerror} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position4}>ผิดพลาด{"\n"}</Text>
              <View></View>
              <Text style={styles.position5}>ที่อยู่นี้{"\n"}ถูกใช้ในการจัดส่งไปแล้ว !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  renderItem = ({ item }) => {

    const select =
      <View style={{ alignItems: 'flex-start', marginTop: hp('0%') }}>
        {/* <Image style={styles.imageChecked} source={ImgChecked}/> */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <TouchableOpacity style={styles.btnSelected4}>
            <Text style={styles.btnSelectedText}>[ ค่าเริ่มต้น ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSelected3} onPress={() => this.onButtonShowMap(item)}>
            <Image style={styles.inputIcon} source={ImgMap} />
          </TouchableOpacity>
        </View>
      </View>

    const start =
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: hp('0%') }}>
        <TouchableOpacity style={styles.btnSelected} onPress={() => this.onButtonSelect(item)}>
          <Text style={styles.btnSelectedText}>[ ตั้งค่าเริ่มต้น ]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSelected2} onPress={() => this.onButtonShowMap(item)}>
          <Image style={styles.inputIcon} source={ImgMap} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSelected2} onPress={() => this.setState({ show: true, itemSelect: item })}>
          <Image style={styles.inputIcon} source={ImgBin} />
        </TouchableOpacity>
      </View>

    let btnSelect;
    if (item.default_flag == 'Y') {
      btnSelect = select
    } else {
      btnSelect = start
    }

    const viewSelectYY =
      <TouchableHighlight underlayColor={'white'} style={styles.card} onPress={() => this.clickEventListener(item)}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: wp('5%') }}>
            <Image style={styles.image} source={ImgLocation} />
          </View>
          <View style={styles.cardContent2}>
            <Image style={styles.fav} source={ImgFav} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.receiver_id}</Text>
              <View style={styles.span}></View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.name}>{item.phone}</Text>
              <Text numberOfLines={2} ellipsizeMode='tail' style={styles.name}>{item.address}</Text>
              {btnSelect}
            </View>
          </View>
        </View>
      </TouchableHighlight>

    const viewSelectNN =
      <TouchableHighlight underlayColor={'white'} style={styles.card} onPress={() => this.clickEventListener(item)}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: wp('5%') }}>
            <Image style={styles.image} source={ImgLocation} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.name}>{item.receiver_id}</Text>
            <View style={styles.span}></View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.name}>{item.phone}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.name}>{item.address}</Text>
            {btnSelect}
          </View>
        </View>
      </TouchableHighlight>

    let viewSelectY;
    let viewSelectN;
    if (item.default_flag == 'Y') {
      viewSelectY = viewSelectYY
    } else {
      viewSelectN = viewSelectNN
    }

    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {viewSelectY}
        {viewSelectN}
      </ScrollView>
    )
  }

  renderHiddenItem = ({ item }) => {

    return (
      <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.onButtonShowMap(item) }}>
            <View style={styles.notificationBoxSwipeStart1}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.inputIcon2} source={ImgMap} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ show: true, itemSelect: item }) }}>
            <View style={styles.notificationBoxSwipeStart2}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.inputIcon2} source={ImgBin} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.onButtonShowMap(item) }}>
            <View style={styles.notificationBoxSwipeEnd1}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.inputIcon2} source={ImgMap} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ show: true, itemSelect: item }) }}>
            <View style={styles.notificationBoxSwipeEnd2}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.inputIcon2} source={ImgBin} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ width: "100%", height: "100%" }} >
          <ActivityIndicator style={{ color: "#fcfcfc" }} />
        </View>
      );
    }

    let MyParcelList;
    if (this.state.foundParcel) {
      MyParcelList =
        <SwipeListView
          style={styles.userList}
          data={this.state.dataShippingList.data.shippings}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          // disableRightSwipe={true}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      // <FlatList
      //   style={styles.userList}
      //   data={this.state.dataShippingList.data.shippings}
      //   extraData={this.state}
      //   refreshControl={
      //     <RefreshControl
      //       refreshing={this.state.isRefreshing}
      //       onRefresh={this.onRefresh.bind(this, this.state.phones)}
      //     />}
      //   renderItem={this.renderItem}
      //   keyExtractor={(item, index) => index.toString()}
      // />
    } else {
      MyParcelList =
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: wp('30%'), height: hp('15%'), resizeMode: 'contain', marginBottom: hp('4%') }} source={ImgLocation2} />
          <Text style={{ marginTop: 0, fontSize: hp('2.5%'), color: '#d6d6d6', fontFamily: 'kanit', fontWeight: 'bold' }}>ไม่พบรายการที่อยู่</Text>
        </View>
    }

    return (
      <View style={styles.screen}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        {MyParcelList}

        <Fab
          containerStyle={{}}
          style={{ backgroundColor: '#23527c' }}
          position="bottomRight"
          onPress={() => this.onNext()}>
          <Icon1 name="plus" />
        </Fab>

        <Modal
          isVisible={this.state.visibleModal === 1}
          backdropColor='#00000057'
          animationIn='zoomIn'
          animationInTiming={1200}
          animationOut='zoomOutUp'
          animationOutTiming={600}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentShippingAddress()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 99}
          backdropColor='#00000057'
          animationIn='zoomIn'
          animationInTiming={1200}
          animationOut='zoomOutUp'
          animationOutTiming={600}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentShowMap()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 0}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentDelete()}
        </Modal>

        <SCLAlert
          onRequestClose={this.handleClose}
          headerIconComponent={<Image source={ImgBin} style={{ height: hp('7%'), width: wp('14%') }} />}
          show={this.state.show}
          title="ยืนยัน"
          // titleStyle={{fontWeight: 'bold'}}
          subtitle="ต้องการลบที่อยู่หรือไม่"
          subtitleStyle={{ color: '#999' }}
        >
          <SCLAlertButton textStyle={{ color: '#fff' }} theme='danger' onPress={() => this.onButtonSubmitDelete(this.state.itemSelect)}>ยืนยันลบที่อยู่</SCLAlertButton>
          <SCLAlertButton textStyle={{ color: '#5a6775' }} containerStyle={{ backgroundColor: '#d5d5d5' }} onPress={this.handleClose}>ยกเลิก</SCLAlertButton>
        </SCLAlert>

      </View>
    );
  }
}

export default withNavigation(shippingList)

const dataShippingList = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "shippings": [
      {
        "no": "",
        "receiver_id": "",
        "name": "",
        "phone": "",
        "address": "",
        "subdistrict": "",
        "district": "",
        "province": "",
        "zipcode": "",
        "latitude": "",
        "longitude": "",
        "default_flag": ""
      }
    ]
  }
}

const dataShipping = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "shipping": {
      "receiver_id": "",
      "name": "",
      "phone": "",
      "address": "",
      "subdistrict": "",
      "district": "",
      "province": "",
      "zipcode": "",
      "latitude": "",
      "longitude": "",
      "default_flag": ""
    }
  }
}

const dataDefault = {
  "result": "",
  "status": "",
  "message": ""
}

const dataDeleteShipping = {
  "result": "",
  "status": "",
  "message": ""
}

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0100;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  screen: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    // paddingTop: 10,
    // borderTopWidth: 3,
    // borderTopColor: '#d8d8d8'
  },
  userList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: wp('0%'),
    marginVertical: hp('2%'),
    paddingTop: hp('2%'),
    paddingRight: wp('5%'),
    paddingBottom: hp('2%'),
    alignSelf: 'center',
    width: wp('58%'),
  },
  cardContent2: {
    marginLeft: wp('2%'),
    paddingRight: wp('0%'),
    alignItems: 'flex-end',
    width: wp('55%'),
    // backgroundColor: '#000'
  },
  image: {
    width: wp('12%'),
    height: hp('12%'),
    resizeMode: 'contain'
  },
  card: {
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,
    // elevation: 12,

    marginVertical: hp('2%'),
    marginHorizontal: wp('3%'),
    backgroundColor: "#fff",
    flexBasis: '46%',
    // padding: 10,
    borderWidth: wp('0.75'),
    borderColor: '#eee',
    borderRadius: 20,
    flexDirection: 'row',
  },
  notificationBoxSwipeStart1: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginVertical: hp('3%'),
    marginHorizontal: wp('2.75%'),
    backgroundColor: "#23527c",
    width: wp('16%'),
    height: hp('12%'),
    padding: wp('2%'),
    borderWidth: wp('0.5%'),
    borderColor: '#eee',
    borderRadius: 10,
  },
  notificationBoxSwipeStart2: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginVertical: hp('3%'),
    marginHorizontal: wp('2.75%'),
    backgroundColor: "#cb3837",
    width: wp('16%'),
    height: hp('12%'),
    padding: wp('2%'),
    borderWidth: wp('0.5%'),
    borderColor: '#eee',
    borderRadius: 10,
  },
  notificationBoxSwipeEnd1: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginVertical: hp('3%'),
    marginHorizontal: wp('2.75%'),
    backgroundColor: "#23527c",
    width: wp('16%'),
    height: hp('12%'),
    padding: wp('2%'),
    borderWidth: wp('0.5%'),
    borderColor: '#eee',
    borderRadius: 10,
  },
  notificationBoxSwipeEnd2: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginVertical: hp('3%'),
    marginHorizontal: wp('2.75%'),
    backgroundColor: "#cb3837",
    width: wp('16%'),
    height: hp('12%'),
    padding: wp('2%'),
    borderWidth: wp('0.5%'),
    borderColor: '#eee',
    borderRadius: 10,
  },
  name: {
    fontSize: hp('2%'),
    flex: 1,
    alignSelf: 'flex-start',
    color: "#778899",
    // fontFamily: 'kanit',
  },
  position: {
    fontSize: hp('1.7%'),
    color: "#696969",
    textAlign: 'left'
  },
  btnSelected: {
    width: isIphoneX ? wp('29%') : wp('24%'),
    height: hp('5%'),
    marginTop: hp('2%'),
    marginRight: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  btnSelected2: {
    width: wp('5%'),
    height: hp('5%'),
    marginTop: hp('2%'),
    marginRight: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  btnSelected3: {
    width: wp('5%'),
    height: hp('5%'),
    // marginLeft:10,
    marginTop: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  btnSelected4: {
    width: isIphoneX ? wp('24%') : wp('20%'),
    height: hp('5%'),
    marginTop: hp('2%'),
    marginRight: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  btnSelectedText: {
    color: "#999",
    fontSize: hp('1.8%'),
  },
  imageChecked: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
    marginBottom: hp('1%'),
    marginLeft: wp('3%'),
  },
  fav: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
    position: 'absolute',
  },
  inputIcon: {
    width: wp('8%'),
    height: hp('4%'),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon2: {
    width: wp('12%'),
    height: hp('6%'),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  /************ modals ************/
  popup: {
    backgroundColor: 'white',
    marginHorizontal: wp('5%'),
    borderRadius: 20,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    justifyContent: 'center'
  },
  popupContent: {
    //alignItems: 'center',
    margin: wp('2%'),
    height: hp('60%'),
  },
  popupContent2: {
    //alignItems: 'center',
    margin: wp('2%'),
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
    backgroundColor: '#20b2aa', //4682b4
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
    color: "#999999",
    fontFamily: 'kanit',
    fontSize: hp('2.2%'),
  },
  Imgerror: {
    width: wp('17.5%'),
    height: hp('8.75'),
    resizeMode: 'contain',
  },
  position4: {
    textAlign: 'center',
    fontSize: hp('2.2%'),
    color: "#999999",
    fontFamily: 'kanit',
    fontWeight: 'bold',
    marginBottom: hp('0.75'),
    marginTop: hp('1.25%')
  },
  position5: {
    color: "#999999",
    fontFamily: 'kanit',
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  //////////////////////////box/////////////////
  imageUser: {
    width: wp('26%'),
    height: hp('13%'),
    resizeMode: 'contain',
    marginLeft: wp('4%'),
  },
  box: {
    padding: wp('2%'),
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
    fontSize: hp('3%'),
    color: "#fff", //474747
  },
  description: {
    fontSize: hp('2%'),
    color: "#646464",
  },
  //////////////////////////////////////////
  span: {
    borderBottomWidth: wp('0.5%'),
    borderBottomColor: '#eee',
    marginRight: wp('1%'),
    marginVertical: hp('1%'),
  },
  map: {
    position: "relative",
    width: wp('80%'),
    height: hp('60%'),
    borderRadius: 20
  },
}); 

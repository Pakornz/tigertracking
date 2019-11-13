import React from "react";
import axios from "axios";
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { StatusBar, StyleSheet, View, Image, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
import RNPickerSelect from 'react-native-picker-select';
import { domain, domainHis } from '../../config/configApp'


class AddressInsertScreen extends React.Component {
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
      dataPass: this.props.navigation.state.params.dataPass,

      resGenAddress: resGenAddress,
      resAddress: resAddress,
      resAddress2: resAddress2,
      resAddress3: resAddress3,

      name: '',
      mobilephone: '',
      address: '',
      subdistrict: '',
      district: '',
      province: '',
      zipcode: '',
      latitude: '',
      longitude: '',

      llat: '',
      llng: '',

    }

    console.log('@@@@@@@@@pageAddressInsert@@@@@@@@@@', this.state.dataPassBack);
    console.log('@@@@@@@@@pageAddressInsert@@@@@@@@@@', this.state.dataPass);



  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageAddressInsert', this.state.phones);
    });

    if (!this.state.dataPass) {
      null
      console.log('@@@@@@@@@pageAddressInsert-DataPass-Null@@@@@@@@@@');
    } else {
      this.setState({
        mobilephone: this.props.navigation.state.params.dataPass.mobile_phone,
        name: `${this.props.navigation.state.params.dataPass.firstname} ${this.props.navigation.state.params.dataPass.lastname}`
      })
      console.log('@@@@@@@@@pageAddressInsert-DataPass@@@@@@@@@@');
    }

  }

  callApiZipCode(zipcode) {
    if (String(zipcode).length == 5) {
      axios({
        method: 'post',
        url: `${domainHis}/hisherapp2/searchAddress`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          zipcode: Number(zipcode)
        }
      })
        .then(res => {
          const resAddress = res.data
          this.setState({
            resAddress: resAddress
          })
          console.log('########Address########', this.state.resAddress)

        })
        .catch(error => {
          // console.log(error)
          // const err = JSON.parse(error.request._response)
        });
    } else {
      this.setState({
        province: null,
        district: null,
        subdistrict: null
      })
    }
  }

  callApiProvince(zipcode, province) {
    if (!this.state.province) {
      axios({
        method: 'post',
        url: `${domainHis}/hisherapp2/searchAddress`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          zipcode: Number(zipcode),
          province: `${province}`
        }
      })
        .then(res => {
          const resAddress2 = res.data
          this.setState({
            resAddress2: resAddress2
          })
          console.log('########Address########', resAddress2.province)

        })
        .catch(error => {
          // console.log(error)
          // const err = JSON.parse(error.request._response)
        });
    } else {
      this.setState({
        province: null,
        district: null,
        subdistrict: null
      })
    }
  }

  callApiDistrict(zipcode, province, district) {
    if (!this.state.district) {
      axios({
        method: 'post',
        url: `${domainHis}/hisherapp2/searchAddress`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          zipcode: Number(zipcode),
          province: `${province}`,
          amphoe: `${district}`
        }
      })
        .then(res => {
          const resAddress3 = res.data
          this.setState({
            resAddress3: resAddress3
          })
          console.log('########Address########', resAddress3.amphoe)

        })
        .catch(error => {
          // console.log(error)
          // const err = JSON.parse(error.request._response)
        });
    } else {
      this.setState({
        district: null,
        subdistrict: null
      })
    }
  }

  onButtonMap = (name, mobilephone, address, subdistrict, district, province, zipcode) => {

    if (!name) {
      this.setState({ visibleModal: 1 })
    } else if (!mobilephone || mobilephone.length < 10) {
      this.setState({ visibleModal: 2 })
    } else if (!address) {
      this.setState({ visibleModal: 3 })
    } else if (!zipcode) {
      this.setState({ visibleModal: 4 })
    } else if (zipcode.length < 5) {
      this.setState({ visibleModal: 8 })
    } else if (!province) {
      this.setState({ visibleModal: 5 })
    } else if (!district) {
      this.setState({ visibleModal: 6 })
    } else if (!subdistrict) {
      this.setState({ visibleModal: 7 })
    } else {
      Geocoder.setApiKey('AIzaSyDQLkhf_XP9r2Gd8AUUWqXghzsqwpQzv48')
      Geocoder.getFromLocation(`${subdistrict} ${district} ${province} ${zipcode}`)
        .then(json => {
          var location = json.results[0].geometry.location;
          // alert(location.lat + `,` + location.lng);

          this.setState({
            llat: location.lat,
            llng: location.lng,
          })

          const dataMap = {
            name: name,
            mobilephone: mobilephone,
            address: address,
            zipcode: zipcode,
            province: province,
            district: district,
            subdistrict: subdistrict,
            latitude: this.state.llat,
            longitude: this.state.llng,
          }

          this.props.navigation.navigate('AddressMapScreen', { dataMap: dataMap })

        })
        .catch(error => {
          console.log(error)
          // const err = JSON.parse(error.request._response)
        });
    }
  }

  onValueChange2(value) {
    this.setState({
      selected2: value
    });
  }

  onTest = async (zipcode) => {
    await this.setState({ zipcode: zipcode }) // event.target = undefined
    this.callApiZipCode(zipcode)
  }

  onTest2 = async (zipcode, province) => {
    this.callApiProvince(zipcode, province)
  }

  onTest3 = async (zipcode, province, district) => {
    this.callApiDistrict(zipcode, province, district)
  }

  renderModalContentName = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่ชื่อ - นามสกุล !</Text>
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
  );

  renderModalContentMobilephone = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่เบอร์โทรศัพท์ !</Text>
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
  );

  renderModalContentAddress = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่บ้านเลขที่ / อาคาร / อื่นๆ !</Text>
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
  );

  renderModalContentZipcode = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่รหัสไปรษณีย์ !</Text>
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
  );

  renderModalContentZipcode2 = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่รหัสไปรษณีย์ ให้ถูกต้อง!</Text>
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
  );

  renderModalContentProvince = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาเลือกจังหวัด !</Text>
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
  );

  renderModalContentDistrict = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาเลือก อำเภอ/เขต !</Text>
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
  );

  renderModalContentSubdistrict = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: 10, alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาเลือก ตำบล/แขวง !</Text>
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
  );

  checkmobile = (mobilephone) => {

    let mobile = mobilephone.replace(/[.*+?^${}()|[\]\\]|,|-|#/g, "")
    this.setState({ mobilephone: mobile })

  }

  render() {

    const placeholder1 = {
      label: 'จังหวัด',
      value: null,
      color: '#c9c9c9', //9EA0A4
    };
    const placeholder2 = {
      label: 'อำเภอ/เขต',
      value: null,
      color: '#c9c9c9', //9EA0A4
    };
    const placeholder3 = {
      label: 'ตำบล/แขวง',
      value: null,
      color: '#c9c9c9', //9EA0A4
    };

    var aa = []
    var bb = []
    var cc = []

    var DATAADDRESS = this.state.resAddress
    var DATAADDRESS2 = this.state.resAddress2
    var DATAADDRESS3 = this.state.resAddress3

    if (!DATAADDRESS) {
      null
    } else {
      DATAADDRESS.province.map((pp) => {
        label = pp.text
        value = pp.value
        aa.push({ label, value })
      })
    }


    if (!DATAADDRESS2) {
      null
    } else {
      DATAADDRESS2.amphoe.map((pp) => {
        label = pp.text
        value = pp.value
        bb.push({ label, value })
      })
    }

    if (!DATAADDRESS3) {
      null
    } else {
      DATAADDRESS3.district.map((pp) => {
        label = pp.text
        value = pp.value
        cc.push({ label, value })
      })
    }



    const province = aa

    const district = bb

    const subdistrict = cc

    return (
      <View style={styles.screen}>
        <Header style={{ backgroundColor: '#fcfcfc', flexDirection: 'row' }}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fcfcfc" translucent={false} />

          <Left style={{ flex: 1 }}>
            <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }} transparent onPress={() => this.props.navigation.navigate('AddressShowScreen')}>
              <Icon6 name="ios-arrow-back" size={wp('7%')} color='#778899' />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 2, alignItems: 'center' }}>
            <Image source={Img} style={styles.logo} />
          </Body>
          <Right>
          </Right>
        </Header>

        <View style={styles.box}>
          <Text style={styles.title}>เพิ่มที่อยู่จัดส่ง</Text>
        </View>

        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('3.5%') }}>

          <View style={styles.container}>

            <View style={styles.inputContainer}>
              <Icon5 name='person' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="ชื่อ - นามสกุล"
                placeholderTextColor="#c9c9c9"
                underlineColorAndroid='transparent'
                defaultValue={this.state.name}
                onChangeText={(name) => this.setState({ name })} />
            </View>

            {/* <View style={styles.inputContainer}>
              <Icon4 name='mobile1' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="เบอร์โทรศัพท์"
                placeholderTextColor="#c9c9c9"
                keyboardType="phone-pad"
                maxLength={10}
                underlineColorAndroid='transparent'
                onChangeText={(mobilephone) => this.setState({ mobilephone })} />
            </View> */}

            <View style={styles.inputContainer}>
              <Icon4 name='mobile1' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="เบอร์โทรศัพท์"
                placeholderTextColor="#c9c9c9"
                keyboardType="phone-pad"
                maxLength={10}
                underlineColorAndroid='transparent'
                defaultValue={this.state.mobilephone}
                onChangeText={(mobilephone) => { this.checkmobile(mobilephone) }} />
            </View>

            <View style={styles.inputContainer}>
              <Icon1 name='home' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="บ้านเลขที่ / อาคาร / อื่นๆ"
                placeholderTextColor="#c9c9c9"
                underlineColorAndroid='transparent'
                onChangeText={(address) => this.setState({ address })} />
            </View>

            <View style={styles.inputContainer}>
              <Icon3 name='address' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="รหัสไปรษณีย์"
                placeholderTextColor="#c9c9c9"
                underlineColorAndroid='transparent'
                keyboardType="phone-pad"
                maxLength={5}
                onChangeText={(zipcode) => this.onTest(zipcode)}
              />
            </View>

            <View style={styles.picker}>
              <Icon5 name='edit-location' style={styles.inputIcon} style={{ paddingLeft: wp('1.5%'), fontSize: hp('2.5%') }} />
              <RNPickerSelect
                placeholder={placeholder1}
                items={province}
                onValueChange={(value) => {
                  this.setState({
                    province: value,
                  }), this.onTest2(this.state.zipcode, value)
                }}
                style={pickerSelectStyles}
                value={this.state.province}
              // useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.picker}>
              <Icon5 name='edit-location' style={styles.inputIcon} style={{ paddingLeft: wp('1.5%'), fontSize: hp('2.5%') }} />
              <RNPickerSelect
                placeholder={placeholder2}
                items={district}
                onValueChange={(value) => {
                  this.setState({
                    district: value,
                  }), this.onTest3(this.state.zipcode, this.state.province, value)
                }}
                style={pickerSelectStyles}
                value={this.state.district}
              // useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.picker}>
              <Icon5 name='edit-location' style={styles.inputIcon} style={{ paddingLeft: wp('1.5%'), fontSize: hp('2.5%') }} />
              <RNPickerSelect
                placeholder={placeholder3}
                items={subdistrict}
                onValueChange={(value) => {
                  this.setState({
                    subdistrict: value,
                  });
                }}
                style={pickerSelectStyles}
                value={this.state.subdistrict}
              // useNativeAndroidPickerStyle={false}
              />
            </View>

            <TouchableOpacity style={{ width: wp('60%'), borderWidth: wp('0.5%'), borderColor: '#d5d5d5', borderStyle: 'dashed', borderRadius: 20, marginVertical: hp('1.5%') }}
              onPress={() => this.onButtonMap(
                this.state.name,
                this.state.mobilephone,
                this.state.address,
                this.state.subdistrict,
                this.state.district,
                this.state.province,
                this.state.zipcode,
              )} >
              <Image style={styles.mapImg} source={ImgMap} />
              <Text style={{ fontSize: hp('2.2%'), color: '#999', alignSelf: 'center', marginBottom: hp('1.5%') }}>แผนที่</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonContainer2, styles.loginButton2]}
              onPress={() => {
                this.onButtonMap(
                  this.state.name,
                  this.state.mobilephone,
                  this.state.address,
                  this.state.subdistrict,
                  this.state.district,
                  this.state.province,
                  this.state.zipcode,
                )
              }}>
              <Text style={styles.loginText2}>กรุณาเลือกตำแหน่งที่อยู่ในแผนที่</Text>
            </TouchableOpacity>

          </View>

        </KeyboardAwareScrollView>

        <Modal
          isVisible={this.state.visibleModal === 1}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentName()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 2}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentMobilephone()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 3}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentAddress()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 4}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentZipcode()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 5}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentProvince()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 6}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentDistrict()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 7}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentSubdistrict()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 8}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentZipcode2()}
        </Modal>

      </View>
    );
  }
}

export default withNavigation(AddressInsertScreen)

const { width, height } = Dimensions.get('window');

const resAddress = {
  "zipcode": "",
  "province": [
    {
      "text": "",
      "value": "จังหวัด"
    }
  ],
  "amphoe": [
    {
      "text": "",
      "value": "อำเภอ/เขต"
    }
  ],
  "district": [
    {
      "text": "",
      "value": "ตำบล/แขวง"
    }
  ]
}

const resAddress2 = {
  "zipcode": "",
  "province": [
    {
      "text": "",
      "value": "จังหวัด"
    }
  ],
  "amphoe": [
    {
      "text": "",
      "value": "อำเภอ/เขต"
    }
  ],
  "district": [
    {
      "text": "",
      "value": "ตำบล/แขวง"
    }
  ]
}

const resAddress3 = {
  "zipcode": "",
  "province": [
    {
      "text": "",
      "value": "จังหวัด"
    }
  ],
  "amphoe": [
    {
      "text": "",
      "value": "อำเภอ/เขต"
    }
  ],
  "district": [
    {
      "text": "",
      "value": "ตำบล/แขวง"
    }
  ]
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
    height: hp('6'),
    marginLeft: wp('4%'),
    borderBottomColor: '#FFFFFF',
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
    fontSize: hp('2.2%')
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
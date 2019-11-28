import React from 'react';
import { Root } from 'native-base';
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import { fadeIn, fromRight, fromLeft, fromTop, fromBottom, zoomOut, zoomIn, flipX, flipY } from 'react-navigation-transitions';
import SideBar from "./components/drawer/sidebar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Scene, Router, Stack, Drawer } from 'react-native-router-flux';

import SplashScreen from './screen/SplashScreen/SplashScreen';
import LoginScreen from './screen/LoginScreen/LoginScreen';
import ConfirmOtpScreen from './screen/RegisterScreen/ConfirmOtpScreen';
import ReceiveOtpScreen from './screen/RegisterScreen/ReceiveOtpScreen';
import RegisterScreen from './screen/RegisterScreen/RegisterScreen';
import RePasswordScreen from './screen/RegisterScreen/RePasswordScreen';
import HomeScreen from './screen/HomeScreen/HomeScreen';
import MyProfileScreen from './screen/MyProfileScreen/MyProfileScreen';
import MyProfileQrcode from './screen/MyProfileScreen/MyProfileQrcode';
import MyProfileBarcode from './screen/MyProfileScreen/MyProfileBarcode';
import AddressShowScreen from './screen/AddressScreen/AddressShowScreen';
import AddressMapScreen from './screen/AddressScreen/AddressMapScreen';
import AddressInsertScreen from './screen/AddressScreen/AddressInsertScreen';
import AddressInsertSubmitScreen from './screen/AddressScreen/AddressInsertSubmitScreen';
import TrackingTabScreen from './screen/TrackingScreen/TrackingTabScreen';
import TrackingProgress from './screen/TrackingScreen/TrackingProgress';
import TrackingComplete from './screen/TrackingScreen/TrackingComplete';
import TestApp from './TestApp';
import TestApp2 from './TestApp2';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Header from './components/header/headerCom'
import TestApp3 from './TestApp3';
import NotifyScreen from './screen/NotifyScreen/NotifyScreen';


const DrawerHomeScreen = createDrawerNavigator(
  {
    HomeScreen: { screen: HomeScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />,
    drawerWidth: wp('80%')
  }
);

const DrawerAddressShowScreen = createDrawerNavigator(
  {
    AddressShowScreen: { screen: AddressShowScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />,
    drawerWidth: wp('80%')
  }
);

const DrawerMyProfileScreen = createDrawerNavigator(
  {
    MyProfileScreen: { screen: MyProfileScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />,
    drawerWidth: wp('80%')
  }
);

const DrawerTrackingTabScreen = createDrawerNavigator(
  {
    TrackingTabScreen: { screen: TrackingTabScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />,
    drawerWidth: wp('80%')
  }
);

const AppNavigator = createStackNavigator(
  {
    SplashScreen: { screen: SplashScreen },

    LoginScreen: { screen: LoginScreen },
    ReceiveOtpScreen: { screen: ReceiveOtpScreen },
    ConfirmOtpScreen: { screen: ConfirmOtpScreen },
    RegisterScreen: { screen: RegisterScreen },
    RePasswordScreen: { screen: RePasswordScreen },

    DrawerHomeScreen: { screen: DrawerHomeScreen },

    DrawerAddressShowScreen: { screen: DrawerAddressShowScreen },
    AddressInsertScreen: { screen: AddressInsertScreen },
    AddressMapScreen: { screen: AddressMapScreen },
    AddressInsertSubmitScreen: { screen: AddressInsertSubmitScreen },

    DrawerMyProfileScreen: { screen: DrawerMyProfileScreen },
    MyProfileQrcode: { screen: MyProfileQrcode },
    MyProfileBarcode: { screen: MyProfileBarcode },

    DrawerTrackingTabScreen: { screen: DrawerTrackingTabScreen },
    TrackingProgress: { screen: TrackingProgress },
    TrackingComplete: { screen: TrackingComplete },

    NotifyScreen: { screen: NotifyScreen },

    TestApp: { screen: TestApp },
    TestApp2: { screen: TestApp2 },
    TestApp3: { screen: TestApp3 }
  },
  {
    initialRouteName: "TestApp3",
    transitionConfig: (nav) => handleCustomTransition(nav),
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  }
);

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (prevScene
    && prevScene.route.routeName === 'SplashScreen'
    && nextScene.route.routeName === 'LoginScreen') {
    return zoomOut(1000);
  } else if (prevScene
    && prevScene.route.routeName === 'SplashScreen'
    && nextScene.route.routeName === 'DrawerHomeScreen') {
    return zoomOut(1000);
  } else if (prevScene
    && prevScene.route.routeName === 'DrawerHomeScreen'
    && nextScene.route.routeName === 'NotifyScreen') {
    return fromRight(500);
  } else if (prevScene
    && prevScene.route.routeName === 'DrawerAddressShowScreen'
    && nextScene.route.routeName === 'NotifyScreen') {
    return fromRight(500);
  } else if (prevScene
    && prevScene.route.routeName === 'DrawerMyProfileScreen'
    && nextScene.route.routeName === 'NotifyScreen') {
    return fromRight(500);
  } else if (prevScene
    && prevScene.route.routeName === 'DrawerTrackingTabScreen'
    && nextScene.route.routeName === 'NotifyScreen') {
    return fromRight(500);
  }

  return fadeIn(0);
}

const RouterComponent = createAppContainer(AppNavigator);

export default () =>
  <Root>
    <RouterComponent />
  </Root>;
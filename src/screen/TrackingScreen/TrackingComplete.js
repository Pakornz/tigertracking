import React from "react";
import { StatusBar,StyleSheet,ScrollView,Image,TouchableHighlight} from "react-native";
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Left, Right, Button, Body, Content,Text,Footer, FooterTab,Tab, Tabs, TabHeading, View,Fab,Icon } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import SendComplete from '../../components/tracking/sendComplete';

export default class TrackingComplete extends React.Component {
  constructor(props) {
    super(props)

    }
  render() {
    return (
      <View style={styles.screen}>

          <SendComplete />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
});
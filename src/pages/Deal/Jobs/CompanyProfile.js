// Saurabh Saneja August 14, 2023 view profile
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from "react-native";
import JobsHeader from "./components/JobsHeader";
import JobsSearch from "./components/JobsSearch";
import { dimensions } from "../../../utility/Mycolors";
import MyAlert from "../../../component/MyAlert";
import { requestGetApi, deal_job_profile } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import moment from "moment";

const skills = [
  {
    id: "1",
    name: "Leadership",
  },
  {
    id: "2",
    name: "Teamwork",
  },
  {
    id: "3",
    name: "Visioner",
  },
  {
    id: "4",
    name: "Target oriented",
  },
  {
    id: "5",
    name: "Consistent",
  },
  {
    id: "6",
    name: "Leadership",
  },
  {
    id: "7",
    name: "Teamwork",
  },
  {
    id: "8",
    name: "Visioner",
  },
];
const languages = [
  {
    id: "1",
    name: "English",
  },
  {
    id: "2",
    name: "German",
  },
  {
    id: "3",
    name: "Spanish",
  },
  {
    id: "4",
    name: "Mandarin",
  },
  {
    id: "5",
    name: "Italian",
  },
];
const CompanyProfile = (props) => {
  const userdetaile = useSelector((state) => state.user.user_details);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [profileData, setProfileData] = useState({});
  const [tabs, setTabs] = useState([
    {
      id: '1',
      name: 'About Us'
    },
    {
      id: '2',
      name: 'Jobs'
    },
  ]);
  const [selectedTab, setSelectedTab] = useState('1')

  useEffect(() => {
    console.log("userdetaile.token", userdetaile);
    // getProfileData();
  }, []);
  // Saurabh Saneja August 14, 2023 get profile data
  const getProfileData = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      deal_job_profile + userdetaile.userid,
      "",
      "GET",
      userdetaile.token
    );
    setLoading(false);
    console.log("getProfileData responseJson", responseJson);
    if (responseJson.success == 1) {
      setProfileData(responseJson.body);
    } else {
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const changeSelectedTab = (id) => {
    if(selectedTab === id){
      return
    }
    setSelectedTab(id)
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
       <CompanyHeader/>
       <View style={styles.container}>
        <View style={styles.iconBtnRow}>
            <IconButton text='Post Jobs' icon={require('./assets/images/jobs-add.png')} onPress={()=>{}} />
            <IconButton text='Visit website' icon={require('./assets/images/jobs-visit.png')} onPress={()=>{}} style={{marginLeft: 20}} />
          </View>

        <View style={styles.tabsRow} >
          {tabs?.map(item => 
            <TouchableOpacity onPress={()=>changeSelectedTab(item.id)} style={[styles.tabView, selectedTab !== item.id ? {backgroundColor: 'white'}: null]} >
              <Text style={[styles.tabTxt, selectedTab !== item.id ? {color: 'black'}: null]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        </View>   
        </View> 
      </ScrollView>
      {loading ? <Loader /> : null}
      {My_Alert ? (
        <MyAlert
          sms={alert_sms}
          okPress={() => {
            setMy_Alert(false);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default CompanyProfile;

const CompanyHeader = ({goBack}) => {
  return (
    <View style={styles.hdrContainer}>
      <View style={styles.hdrTopRow}>
        <TouchableOpacity onPress={goBack} >
            <Image source={require('./assets/images/arrow-left.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack} >
            <Image source={require('./assets/images/bookmark-white.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.iconBg}>
        <Image source={require('./assets/images/google-icon.png')} style={{width: 54.6, height: 54.6}} />
      </View>
      <Text style={styles.compName}>Google</Text>
      <View style={styles.numEmpRow}>
        <View style={styles.numEmpView}>
          <Text style={styles.numEmpText}>1,001-5,000 employees</Text>
        </View>
        <View style={[styles.numEmpView, {marginLeft: 5}]}>
          <Text style={styles.numEmpText}>146 applicants.</Text>
        </View>
      </View>
      <Text style={styles.lctnTxt}>Seattle, USA</Text>
    </View>
  )
}

const IconButton = ({icon, text, onPress, style = {}}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconBtn, style]} >
      <Image source={icon} />
      <Text style={styles.iconTxt}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: "#F8F8F8",
    flex: 1,
  },
  mainView: {
    paddingBottom: "30%",
    // alignItems: "center",
  },
  mainView2: {
    padding: 20,
    paddingTop: 0,
    marginTop: -30,
  },
  hdrContainer:{
    backgroundColor: '#0089CF',
    width: '100%',
    // height: 100,
    paddingTop: 16.6,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30  
  },
  hdrTopRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  iconBg: {
    height: 84,
    width: 84,
    borderRadius: 84/2,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf:'center'
  },
  compName:{
    color: 'white',
    fontSize: 18,
    fontFamily: '700',
    textAlign:'center',
    marginTop: 16
  },
  numEmpRow: {
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11
  },
  numEmpView:{
    backgroundColor:'rgba(255, 255, 255, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 65
  },
  numEmpText:{
    color: 'white',
    fontSize: 11,
    fontFamily: '400'
  },
  lctnTxt:{
    color: 'white',
    fontSize: 16,
    fontFamily: '600',
    textAlign:'center',
    marginTop: 8
  },
  iconBtnRow:{
    // paddingHorizontal: 24,
    marginTop: 21,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  iconBtn:{
    backgroundColor:'rgba(0, 137, 207, 0.12)',
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: 10,
    width: (dimensions.SCREEN_WIDTH -  (24 * 2 + 20)) / 2
  },
  iconTxt:{
    color:'#0089CF',
    fontSize:12,
    fontWeight:'400',
    marginLeft: 10
  },
  container:{
    paddingHorizontal: 24
  },
  tabsRow:{
    marginTop: 18,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  tabView:{
    paddingVertical: 10,
    backgroundColor:'#0089CF',
    alignItems:'center',
    justifyContent:'center',
    width: (dimensions.SCREEN_WIDTH -  (24 * 2 + 20)) / 2
  },
  tabTxt:{
    color:'white',
    fontSize: 14,
    fontWeight: '700'
  }
});

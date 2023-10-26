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
import {
  requestGetApi,
  deal_job_get_job_details,
} from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import moment from "moment";

const SingleJob = (props) => {
  const userdetaile = useSelector((state) => state.user.user_details);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [jobDetails, setJobDetails] = useState({});
  const [tags, setTags] = useState([
    {
      id: "1",
      name: "IT",
    },
    {
      id: "2",
      name: "Full-Time",
    },
    {
      id: "3",
      name: "Junior",
    },
  ]);
  const [tabs, setTabs] = useState([
    {
      id: "1",
      name: "About Us",
    },
    {
      id: "2",
      name: "Jobs",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState("1");

  useEffect(() => {
    console.log("userdetaile.token", userdetaile);
    console.log('props', props?.route?.params?.id);
    getJobData();
  }, []);
  // Saurabh Saneja August 14, 2023 get profile data
  const getJobData = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      deal_job_get_job_details + props?.route?.params?.id,
      "",
      "GET",
      userdetaile.token
    );
    setLoading(false);
    console.log("getJobData responseJson", responseJson);
    if(responseJson?.job && typeof responseJson?.job === 'object'){
      setJobDetails(responseJson.job);
    }
    if (responseJson.success == 1) {
    } else {
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const changeSelectedTab = (id) => {
    if (selectedTab === id) {
      return;
    }
    setSelectedTab(id);
  };
  const getCompanyLocation = (location_details) => {
    if(location_details?.length === 0){
      return ''
    }
    const location = location_details?.find(el => el?.is_default == '1')
    return location?.address_line1 + ' ' + location?.address_line2
  }
  const SingleJobHeader = ({ goBack, tags, data = {} }) => {
    return (
      <View style={styles.hdrContainer}>
        <View style={styles.hdrTopRow}>
          <TouchableOpacity onPress={goBack}>
            <Image source={require("./assets/images/arrow-left.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goBack}>
            <Image source={require("./assets/images/bookmark-white.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.iconBg}>
          <Image
            source={{uri: data?.company_cover_photo}}
            style={{ width: 54.6, height: 54.6 }}
          />
        </View>
        <Text style={styles.compName}>UI/UX Designer</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 16,
          }}
        >
          <Text style={styles.companyName}>{data?.company_name}</Text>
          <View style={styles.dot}></View>
          <Text style={styles.companyName}>{getDiff(data?.created_date)}</Text>
        </View>
        <View style={styles.numEmpRow}>
          {tags?.map((item, index) => (
            <View key={index?.toString()} style={styles.numEmpView}>
              <Text style={styles.numEmpText}>{item?.name}</Text>
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "80%",
            alignSelf: "center",
          }}
        >
          <Text style={styles.lctnTxt}>${data?.salary}/year</Text>
          <Text style={styles.lctnTxt}>{getCompanyLocation(data?.location_details)}</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <SingleJobHeader data={jobDetails} tags={tags} goBack={() => props.navigation.goBack()} />
        <View style={styles.container}>
          <View>
            <Text style={[styles.heading, { marginTop: 26, marginBottom: 23 }]}>
              About Company
            </Text>
            <Text style={styles.valueStyle}>
              {jobDetails?.company_about}
            </Text>

            <Text style={styles.heading}>Industry</Text>
            <Text style={styles.valueStyle}>Internet product</Text>

            <Text style={styles.heading}>Employee size</Text>
            <Text style={styles.valueStyle}>{jobDetails?.employee_count === null ? '' : jobDetails?.employee_count} Employees</Text>

            <Text style={styles.heading}>Head office</Text>
            <Text style={styles.valueStyle}>
              {jobDetails?.company_address}
            </Text>

            <Text style={styles.heading}>Type</Text>
            <Text style={styles.valueStyle}>Multinational company</Text>

            <Text style={styles.heading}>Since</Text>
            <Text style={styles.valueStyle}>{jobDetails?.company_started === null ? '' : jobDetails?.company_started}</Text>

            <Text style={styles.heading}>Specialization</Text>
            <Text style={styles.valueStyle}>
              Search technology, Web computing, Software and Online advertising
            </Text>
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
export default SingleJob;
const getDiff = (created_date) => {
  let diff = null
  const diffYears = moment().diff(created_date, 'years')
  if (diffYears > 0) {
    if(diffYears > 1){
      diff = diffYears + ' yrs ago'
    }else{
      diff = diffYears + ' yr ago'
    }
    return diff
  }
  const diffMonths = moment().diff(created_date, 'months')
  if (diffMonths > 0) {
    if(diffMonths > 1){
      diff = diffMonths + ' months ago'
    }else{
      diff = diffMonths + ' month ago'
    }
    return diff
  }
  const diffdays = moment().diff(created_date, 'days')
  if (diffdays > 0) {
    if(diffdays > 1){
      diff = diffdays + ' days ago'
    }else{
      diff = diffdays + ' day ago'
    }
    return diff
  }
  const diffHours = moment().diff(created_date, 'hours')
  const diffMinutes = moment().diff(created_date, 'minutes')
  const diffOnlyMinutes = diffMinutes % 60
  if (diffHours > 0) {
    let hr = diffHours > 1 ? ' hrs ' : ' hr '
    let min = diffOnlyMinutes > 1 ? ' mins' : ' min'
    diff = diffHours + hr + diffOnlyMinutes + min +' ago'
    return diff
  }
}

const IconButton = ({ icon, text, onPress, style = {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconBtn, style]}>
      <Image source={icon} />
      <Text style={styles.iconTxt}>{text}</Text>
    </TouchableOpacity>
  );
};

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
  hdrContainer: {
    backgroundColor: "#0089CF",
    width: "100%",
    // height: 100,
    paddingTop: 16.6,
    paddingHorizontal: 20,
    paddingBottom: 13,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  hdrTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBg: {
    height: 84,
    width: 84,
    borderRadius: 84 / 2,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  compName: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 24,
  },
  numEmpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11,
  },
  numEmpView: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 65,
    marginRight: 5,
  },
  numEmpText: {
    color: "white",
    fontSize: 11,
    fontWeight: "400",
  },
  lctnTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  iconBtnRow: {
    // paddingHorizontal: 24,
    marginTop: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    backgroundColor: "rgba(0, 137, 207, 0.12)",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: (dimensions.SCREEN_WIDTH - (24 * 2 + 20)) / 2,
  },
  iconTxt: {
    color: "#0089CF",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 10,
  },
  container: {
    paddingHorizontal: 24,
  },
  tabsRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  tabView: {
    paddingVertical: 10,
    backgroundColor: "#0089CF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: (dimensions.SCREEN_WIDTH - (24 * 2 + 40)) / 2,
  },
  tabTxt: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  heading: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 5,
  },
  valueStyle: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
  },
  companyName: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  dot: {
    backgroundColor: "white",
    height: 7,
    width: 7,
    borderRadius: 7 / 2,
    marginLeft: 22,
    marginRight: 32,
  },
});

import React, { useState, useEffect } from "react";
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
import { Mycolors, dimensions } from "../../../utility/Mycolors";
import Modal from "react-native-modal";
import { deal_job_get_jobs, requestGetApi } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import MyAlert from "../../../component/MyAlert";

const recentJobList = [
  {
    id: "1",
    icon: require("./assets/images/google-icon.png"),
    companyName: "Google",
    jobTitle: "UI Designer",
    tags: ["Senior", "Full-Time", "Remote"],
    salary: "$8K",
    salaryMonth: "/Month",
    location: "California, USA",
  },
  {
    id: "2",
    icon: require("./assets/images/google-icon.png"),
    companyName: "Google",
    jobTitle: "UI Designer",
    tags: ["Senior", "Full-Time", "Remote"],
    salary: "$8K",
    salaryMonth: "/Month",
    location: "California, USA",
  },
];

const JobsHome = (props) => {
  const userdetaile = useSelector((state) => state.user.user_details);
  const [searchText, setSearchText] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    getAllJobs();
  }, []);
  const getAllJobs = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      deal_job_get_jobs,
      "",
      "GET",
      userdetaile.token
    );
    setLoading(false);
    console.log("getAllJobs responseJson", JSON.stringify(responseJson));
    if (responseJson.success == 1) {
      setJobData(responseJson.data);
    } else {
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const getCompanyLocation = (location_details) => {
    if(location_details?.length === 0){
      return ''
    }
    const location = location_details?.find(el => el?.is_default == '1')
    return location?.address_line1 + ' ' + location?.address_line2
  }
  const getTags = (item) => {
    const tags = [] 
    const jobType = item?.job_type === null ? 'full time' : item?.job_type
    tags.push(jobType)
    return tags 
  }

  const renderRecentJob = ({ item }) => {
    return (
      <View style={styles.recentJobsContainer}>
        <View style={styles.featuredTopRow}>
          <View style={styles.featuredTopLeftRow}>
            <View style={styles.recentIconBg}>
              <Image source={item?.icon} />
            </View>
          </View>
          <TouchableOpacity>
            <Image
              source={
                true
                  ? require("./assets/images/bookmark-2.png")
                  : require("./assets/images/bookmark-2-selected.png")
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.recentMiddle}>
          <Text style={styles.recentBottomT}>{item.job_title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.recentCompN}>{'companyName'}</Text>
            <View style={styles.dot}></View>
            <Text style={styles.recentLocation}>{getCompanyLocation(item.location_details)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            {getTags(item)?.map((el, index) => (
              <View style={styles.tagView}>
                <Text style={styles.recentTagT}>{el}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentBottomRow}>
          <Text style={styles.timeText}>25 mins ago</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.recentBottomT3}>{'$' + item.salary}</Text>
            <Text style={styles.recentBottomT2}>{'/Month'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const NoData = () => {
    return (
      <View style={styles.noDataContainer}>
        <Image source={require("./assets/images/jobs-no-data.png")} />
        <Text style={styles.noDataText}>No results found</Text>
        <Text style={styles.noDataSubText}>
          The search could not be found, please check spelling or write another
          word.
        </Text>
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
        <JobsHeader text="Home" />
        <View style={styles.mainView2}>
          <JobsSearch value={searchText} setValue={setSearchText} onPress={()=>{setShowFilterModal(true)}} />
          <FlatList
            data={jobData}
            style={{ marginTop: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentJob}
            ListEmptyComponent={NoData}
          />
        </View>
      </ScrollView>
      <Modal
        isVisible={showFilterModal}
        swipeDirection="down"
        onBackdropPress={() => setShowFilterModal(false)}
        onSwipeComplete={(e) => {
          setShowFilterModal(false);
        }}
        scrollTo={() => {}}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor="transparent"
        style={{
          justifyContent: "flex-end",
          margin: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            height: "50%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 30,
                marginTop: 10,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 4,
                  color: Mycolors.Black,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Passions
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{ flex: 1 }}
              >
                <Text
                  style={{
                    color: "#FF3B7F",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: "95%", alignSelf: "center" }}>
              <Text style={{ color: "#4a4c52", fontSize: 12 }}>
                Select passions that you would like to share. Choose a minimum
                of 3.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ color: "#4a4c52", fontSize: 12, fontWeight: "500" }}
                >
                  Passions
                </Text>
                <Text
                  style={{ color: "#4a4c52", fontSize: 12, fontWeight: "500" }}
                >{`${1}/${1}`}</Text>
              </View>
            </View>

            {/* <View style={{width:100,height:100}} /> */}
          </ScrollView>
        </View>
      </Modal>
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
export default JobsHome;

const MyButton = ({ text, onPress, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonT}>{text}</Text>
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
    alignItems: "center",
    flex: 1,
  },
  mainView2: {
    padding: 20,
    paddingTop: 0,
    marginTop: -30,
  },
  featuredTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  featuredTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentIconBg: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    backgroundColor: "rgba(153, 151, 239, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFC40C",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonT: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  recentJobsContainer: {
    padding: 14,
    width: "100%",
    // width: dimensions.SCREEN_WIDTH * 0.6,
    // height: 203,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  recentJobT: {
    color: "#171716",
    fontSize: 14,
    fontWeight: "500",
  },
  recentCompN: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
  },
  recentLocation: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 12,
    fontWeight: "400",
  },
  recentTagT: {
    color: "#524B6B",
    fontSize: 10,
    fontWeight: "400",
  },
  dot: {
    backgroundColor: "#524B6B",
    height: 2,
    width: 2,
    borderRadius: 2 / 2,
    marginLeft: 7,
    marginRight: 5,
  },
  recentBottomT: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  timeText: {
    color: "#AAA6B9",
    fontSize: 10,
    fontWeight: "400",
  },
  recentBottomT3: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
  },
  recentBottomT2: {
    color: "#AAA6B9",
    fontSize: 12,
    fontWeight: "700",
  },
  recentMiddle: {
    marginTop: 22,
  },
  recentBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 21,
  },
  tagView: {
    backgroundColor: "rgba(203, 201, 212, 0.2)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: dimensions.SCREEN_HEIGHT * 0.13,
  },
  noDataText: {
    color: "#150B3D",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 60,
  },
  noDataSubText: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 23,
    width: dimensions.SCREEN_WIDTH * 0.7,
  },
});

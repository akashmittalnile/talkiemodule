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
import { deal_job_candidate_homepage, requestGetApi } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import MyAlert from "../../../component/MyAlert";

const featuredJobsData = [
  {
    id: "1",
    icon: require("./assets/images/fb-icon.png"),
    companyName: "Facebook",
    jobTitle: "Software Engineer",
    tags: ["IT", "Full-Time", "Junior"],
    salary: "$180,00/year",
    location: "California, USA",
  },
  {
    id: "2",
    icon: require("./assets/images/fb-icon.png"),
    companyName: "Facebook",
    jobTitle: "Software Engineer",
    tags: ["IT", "Full-Time", "Junior"],
    salary: "$180,00/year",
    location: "California, USA",
  },
];
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
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    getCandidateHomepage();
  }, []);
  const getCandidateHomepage = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      deal_job_candidate_homepage,
      "",
      "GET",
      userdetaile.token
    );
    setLoading(false);
    console.log("getCandidateHomepage responseJson", JSON.stringify(responseJson));
    if (responseJson.success) {
      console.log('here');
      setProfileData(responseJson.success);
    } else {
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const gotoSearchJobsScreen = () => {
    props.navigation.navigate("SearchJobs");
  };
  const gotoProfile = () => {
    props.navigation.navigate("Profile");
  };
  const gotoCompanyProfile = () => {
    props.navigation.navigate("CompanyProfile");
  };
  const gotoSingleJob = (id = '') => {
    props.navigation.navigate("SingleJob", {id});
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

  const renderFeaturedJob = ({ item }) => {
    return (
      <ImageBackground
        source={require("./assets/images/featured-jobs-blue-bg.png")}
        style={styles.featuredJobsContainer}
        resizeMode="stretch"
      >
        <TouchableOpacity onPress={gotoSingleJob}>
          <View style={styles.featuredTopRow}>
            <View style={styles.featuredTopLeftRow}>
              <View style={styles.iconBg}>
                <Image source={item.icon} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.jobT}>{item.jobTitle}</Text>
                <Text style={styles.compN}>{item.companyName}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image source={require("./assets/images/bookmark.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.featuredMiddleRow}>
            {item.tags?.map((el) => (
              <View style={styles.tagView}>
                <Text style={styles.tagT}>{el}</Text>
              </View>
            ))}
          </View>

          <View style={styles.featuredBottomRow}>
            <Text style={styles.bottomT}>{item.salary}</Text>
            <Text style={styles.bottomT}>{item.location}</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  };
  const renderRecentJob = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => gotoSingleJob(item?.id)} style={styles.recentJobsContainer}>
        <View style={styles.featuredTopRow}>
          <View style={styles.featuredTopLeftRow}>
            <View style={styles.recentIconBg}>
              <Image source={item?.icon} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.recentCompN}>{'companyName'}</Text>
              <Text style={styles.recentLocation}>{getCompanyLocation(item.location_details)}</Text>
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
            {getTags(item)?.map((el, index) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.recentTagT}>{el}</Text>
                {!(getTags(item).length - 1 === index) ? (
                  <View style={styles.tagDot}></View>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentBottomRow}>
          <MyButton
            text="Apply Now"
            style={{
              width: "50%",
              backgroundColor: "#0089CF",
              paddingVertical: 11,
            }}
          />
          <View style={styles.salaryRow}>
            <Text style={styles.recentBottomT}>{'$' + item.salary}</Text>
            {/* <Text style={styles.recentBottomT2}>{item.salaryMonth}</Text> */}
            <Text style={styles.recentBottomT2}>{'/Month'}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
        <JobsSearch
          value={searchText}
          setValue={setSearchText}
          style={{
            width: dimensions.SCREEN_WIDTH - 40,
            alignSelf: "center",
            marginTop: -25,
            zIndex: 999,
            // elevation: 10
          }}
        />
        <View style={styles.mainView2}>
          <View style={styles.findOutContainer}>
            <View style={{ width: "50%" }}>
              <Text style={styles.findOutText}>
                How to find a perfect job for you?
              </Text>
              <MyButton
                text="Find Out"
                style={{ width: "50%", marginTop: 20 }}
              />
            </View>
            <Image source={require("./assets/images/job-search.png")} />
          </View>
          <ViewMore text="Featured Jobs" onPress={gotoProfile} />
          {/* <ViewMore text="Featured Jobs" onPress={gotoCompanyProfile} /> */}
          <FlatList
            data={featuredJobsData}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={renderFeaturedJob}
          />
          <ViewMore text="Recent Job List" onPress={gotoSearchJobsScreen} />
          <FlatList
            data={profileData?.allJobs || []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
            keyExtractor={(_, index) => index?.toString()}
            renderItem={renderRecentJob}
          />
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
export default JobsHome;

const ViewMore = ({ text, onPress }) => {
  return (
    <View style={styles.viewMoreContainer}>
      <Text style={styles.viewMoreHeading}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.viewMoreRightText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  mainView2: {
    padding: 20,
    paddingTop: 0,
    // marginTop: -30,
  },
  findOutContainer: {
    backgroundColor: "#6D2F92",
    borderRadius: 10,
    width: "100%",
    height: 143,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 19,
    marginBottom: 19,
    marginTop: 37,
  },
  findOutText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  viewMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewMoreHeading: {
    color: "#222B45",
    fontSize: 18,
    fontWeight: "500",
  },
  viewMoreRightText: {
    color: "#0089CF",
    fontSize: 13,
    fontWeight: "400",
  },
  featuredJobsContainer: {
    padding: 14,
    width: dimensions.SCREEN_WIDTH * 0.6,
    height: 150,
    marginRight: 15,
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
  iconBg: {
    height: 46,
    width: 46,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
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
  jobT: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  compN: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  featuredMiddleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },
  tagView: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    borderRadius: 15,
  },
  tagT: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  featuredBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
  },
  bottomT: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
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
    width: dimensions.SCREEN_WIDTH * 0.6,
    height: 203,
    marginRight: 15,
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
    color: "#171716",
    fontSize: 16,
    fontWeight: "400",
  },
  recentLocation: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 12,
    fontWeight: "400",
  },
  recentTagT: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 14,
    fontWeight: "400",
  },
  tagDot: {
    backgroundColor: "#BFD4E4",
    height: 4,
    width: 4,
    borderRadius: 4 / 2,
    marginHorizontal: 10,
  },
  recentBottomT: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  recentBottomT2: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 12,
    fontWeight: "500",
  },
  recentMiddle: {
    // flexDirection: "row",
    // alignItems: "center",
    marginTop: 22,
  },
  recentBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 21,
  },
  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

import React, { useState } from "react";
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
  const [searchText, setSearchText] = useState("");

  const renderRecentJob = ({ item }) => {
    return (
      <View style={styles.recentJobsContainer}>
        <View style={styles.featuredTopRow}>
          <View style={styles.featuredTopLeftRow}>
            <View style={styles.recentIconBg}>
              <Image source={item.icon} />
            </View>
          </View>
          <TouchableOpacity>
            <Image source={true ? require("./assets/images/bookmark-2.png") : require("./assets/images/bookmark-2-selected.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.recentMiddle}>
          <Text style={styles.recentBottomT}>{item.jobTitle}</Text>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <Text style={styles.recentCompN}>{item.companyName}</Text>
            <View style={styles.dot}></View>
            <Text style={styles.recentLocation}>{item.location}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 22 }}>
            {item.tags?.map((el, index) => (
              <View style={styles.tagView}>
                <Text style={styles.recentTagT}>{el}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentBottomRow}>
          <Text style={styles.timeText}>25 mins ago</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={styles.recentBottomT3}>{item.salary}</Text>
            <Text style={styles.recentBottomT2}>{item.salaryMonth}</Text>
          </View>
        </View>
      </View>
    );
  };

  const NoData = () => {
    return (
      <View style={styles.noDataContainer} >
        <Image source={require("./assets/images/jobs-no-data.png")} />
        <Text style={styles.noDataText}>No results found</Text>
        <Text style={styles.noDataSubText}>The search could not be found, please check spelling or write another word.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Home" />
        <View style={styles.mainView2}>
          <JobsSearch value={searchText} setValue={setSearchText} />
          <FlatList
            data={recentJobList}
            style={{ marginTop: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentJob}
            ListEmptyComponent={NoData}
          />
        </View>
      </ScrollView>
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
    width:'100%',
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
  tagView:{
    backgroundColor:'rgba(203, 201, 212, 0.2)',
    borderRadius: 8,
    paddingVertical:6,
    paddingHorizontal:24,
    alignItems:'center',
    justifyContent:'center',
    marginRight: 10
  },
  noDataContainer:{
    alignItems:'center',
    marginTop: dimensions.SCREEN_HEIGHT * 0.13 
  },
  noDataText:{
    color:'#150B3D',
    fontSize: 16,
    fontWeight:'700',
    marginTop: 60
  },
  noDataSubText:{
    color:'#524B6B',
    fontSize: 12,
    fontWeight:'400',
    textAlign:'center',
    marginTop: 23,
    width: dimensions.SCREEN_WIDTH * 0.7
  },
});

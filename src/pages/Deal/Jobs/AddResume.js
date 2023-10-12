// Saurabh Saneja August 14, 2023 edit profile
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import JobsHeader from "./components/JobsHeader";
import { dimensions } from "../../../utility/Mycolors";
import MyAlert from "../../../component/MyAlert";
import { requestGetApi, requestPostApi } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import Toast from "react-native-toast-message";

const AddResume = (props) => {
  const userdetaile = useSelector((state) => state.user.user_details);
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Resume" />
        <View style={styles.mainView2}>
          <Text style={styles.title}>Upload CV</Text>
          <Text style={styles.subtitle}>
            Add your CV/Resume to apply for a job
          </Text>
          <TouchableOpacity style={styles.uplaodView}>
            <Image
              source={require("./assets/images/jobs-upload-cv-Icon.png")}
            />
            <Text style={styles.uploadText}>Upload CV/Resume</Text>
          </TouchableOpacity>
          <MyButton
            text="SAVE"
            onPress={() => {}}
            style={{
              backgroundColor: "#0089CF",
              paddingVertical: 20,
              marginTop: 40,
            }}
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
export default AddResume;

const MyButton = ({ text, onPress, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonT}>{text}</Text>
    </TouchableOpacity>
  );
};

const Search = ({ value, setValue }) => {
  return (
    <View style={styles.searchView}>
      <Image source={require("./assets/images/jobs-search-icon.png")} />
      <TextInput
        value={value}
        onChangeText={(e) => setValue(e)}
        placeholder="Search skills"
        placeholderTextColor="#95969D"
        style={styles.inputStyle}
      />
    </View>
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
  },
  title: {
    color: "#150B3D",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: "#524B6B",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  uplaodView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    height: 75,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#455A64",
    borderStyle: "dotted",
  },
  uploadText: {
    color: "#150B3D",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 15
  },
  button: {
    backgroundColor: "#FFC40C",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  buttonT: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 10,
    marginTop: 19,
    marginBottom: 27,
  },
  inputStyle: {
    backgroundColor: "white",
    fontSize: 14,
    fontWeight: "400",
    color: "#95969D",
    width: "80%",
    marginLeft: 13,
  },
  skillTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    // width:'80%'
  },
  skillTextView: {
    backgroundColor: "#0089CF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 97,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  skillText2: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
});

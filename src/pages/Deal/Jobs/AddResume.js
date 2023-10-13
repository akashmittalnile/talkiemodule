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
import { deal_job_resume, requestGetApi, requestPostApi } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import Toast from "react-native-toast-message";
import DocumentPicker from "react-native-document-picker";

const AddResume = (props) => {
  const userdetaile = useSelector((state) => state.user.user_details);
  const [loading, setLoading] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [resumePdf, setResumePdf] = useState({});
  const [info, setInfo] = useState("");

  useEffect(() => {}, []);

  const openDocument = async (setValue) => {
    try {
      const resp = await DocumentPicker.pickSingle({
        // type: [DocumentPicker.types.allFiles]
        type: [DocumentPicker.types.pdf],
      });
      setValue(resp);
      console.log("setValue", resp);
    } catch (error) {
      console.log("error in openDocument", error);
    }
  };
  const validation = () => {
    if (Object.keys(resumePdf)?.length === 0) {
      Toast.show({ text1: "Please Upload CV" });
      return false;
    } 
    // else if (info?.trim()?.length === 0) {
    //   Toast.show({ text1: "Please enter Information" });
    //   return false;
    // }
    return true;
  };
  const apifunction = () => {
    DocumentData.append("file", {
      name: resumePdf.name,
      type: resumePdf.type,
      uri: resumePdf.uri,
    });
  };
  const handleAdd = async () => {
    if (!validation()) {
      return;
    }
    setLoading(true);
    const postData = new FormData();
    postData.append("file", {
      name: resumePdf.name,
      type: resumePdf.type,
      uri: resumePdf.uri,
    });
    console.log("handleAdd postData", JSON.stringify(postData));
    const { responseJson, err } = await requestPostApi(
      deal_job_resume,
      postData,
      "POST",
      userdetaile.token
    );
    setLoading(false);
    console.log("handleAdd responseJson", responseJson);
    if (responseJson.success == 1) {
      Toast.show({ text1: responseJson.message });
      props.navigation.goBack();
    } else {
      Toast.show({ text1: responseJson.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const deleteFile = () => {
    setResumePdf({});
    Toast.show({ text1: "File deleted sucesssfuly" });
  };
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
          {Object.keys(resumePdf)?.length === 0 ? (
            <TouchableOpacity
              onPress={() => openDocument(setResumePdf)}
              style={styles.uplaodView}
            >
              <Image
                source={require("./assets/images/jobs-upload-cv-Icon.png")}
              />
              <Text style={styles.uploadText}>Upload CV/Resume</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedView}>
              <View style={styles.uploadedViewTopRow}>
                <Image
                  source={require("./assets/images/jobs-pdf-icon.png")}
                  style={{ height: 44, width: 44 }}
                />
                <View>
                  <Text style={[styles.uploadText, { width: "70%" }]}>
                    {resumePdf.name}
                  </Text>
                  <View style={styles.uploadedViewMiddleRow}>
                    <Text style={styles.fileInfoText}>867 kb</Text>
                    <Text style={[styles.fileInfoText, { marginTop: 5 }]}>
                      14 Feb 2022 at 11:30 am
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={deleteFile}
                style={styles.uploadedViewBottomRow}
              >
                <Image
                  source={require("./assets/images/jobs-delete-icon.png")}
                />
                <Text style={styles.removeFileText}>Remove File</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={[styles.title, { marginTop: 36, marginBottom: 15 }]}>
            Information
          </Text>
          <TextInput
            placeholder={"Explain why you are the right person for this job"}
            placeholderTextColor="#AAA6B9"
            multiline
            value={info}
            onChangeText={(e) => setInfo(e)}
            style={styles.input}
          />
          <MyButton
            text="SAVE"
            onPress={handleAdd}
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
  uploadedView: {
    marginTop: 24,
    backgroundColor: "rgba(63, 19, 228, 0.05)",
    paddingVertical: 15,
    paddingHorizontal: 20.5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#455A64",
    borderStyle: "dotted",
  },
  uploadedViewTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadedViewMiddleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadedViewBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  uploadText: {
    color: "#150B3D",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 15,
  },
  removeFileText: {
    color: "#FC4646",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 10,
  },
  fileInfoText: {
    color: "#AAA6B9",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 15,
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
  input: {
    color: "#150B3D",
    fontSize: 12,
    fontWeight: "400",
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    height: 232,
    marginBottom: 20,
  },
});

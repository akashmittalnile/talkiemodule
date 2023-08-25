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
  ImageBackground,
  Image,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import JobsHeader from "./components/JobsHeader";
import JobsSearch from "./components/JobsSearch";
import { dimensions } from "../../../utility/Mycolors";
import MyAlert from "../../../component/MyAlert";
import {
  requestGetApi,
  deal_job_profile,
  requestPostApi,
  deal_job_work_experience,
  deal_job_education,
  deal_job_skills,
  deal_job_add_skills,
  deal_job_added_skills,
} from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from "../../../WebApi/Loader";
import DateSelector from "./components/DateSelector";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import Toast from 'react-native-toast-message';

const selectedSkills = [
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
    id: "5",
    name: "Consistent",
  },
];
const allSkills = [
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
    name: "Good communication skills",
  },
  {
    id: "5",
    name: "Consistent",
  },
];
const AddSkills = (props) => {
  const userdetaile = useSelector((state) => state.user.user_details);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isStartDateOpen, setIsStartDateOpen] = useState("");
  const [isEndDateOpen, setIsEndDateOpen] = useState("");
  const [description, setDescription] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [allSkillData, setAllSkillData] = useState([]);
  const [addedSkillData, setAddedSkillData] = useState([]);

  const institutionNameRef = useRef();
  const fieldOfStudyRef = useRef();

  useEffect(() => {
    getSkills();
    getAddedSkills();
  }, []);
  const getSkills = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      deal_job_skills,
      "",
      "GET",
      userdetaile.token
    );
    setLoading(false);
    console.log("getSkills responseJson", responseJson);
    if (responseJson.success == 1) {
      console.log("here");
      setAllSkillData(responseJson.data);
    } else {
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const getAddedSkills = async () => {
    setLoading2(true);
    const { responseJson, err } = await requestGetApi(
      deal_job_added_skills + props?.route?.params?.profileId,
      "",
      "GET",
      userdetaile.token
    );
    setLoading2(false);
    console.log("getAddedSkills responseJson", responseJson);
    if (responseJson.success == 1) {
      console.log("here");
      setAddedSkillData(responseJson.data?.map(el => ({...el, isAdded: true})));
    } else {
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  // Saurabh Saneja August 16, 2023 send work experience data to backend
  const handleAdd = async () => {
    setLoading(true);
    const data = {
      profile_id: props?.route?.params?.profileId,
      // "skill_id" : [1,3,5],
      skill_id: addedSkillData?.map((el) => el?.id),
      status: 1,
    };
    console.log("handleAdd data", data);
    const { responseJson, err } = await requestPostApi(
      deal_job_add_skills,
      data,
      "POST",
      userdetaile.token
    );
    setLoading(false);
    console.log("handleAdd responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      Toast.show({ text1: responseJson.headers.message });
      props.navigation.goBack();
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const handleUnselectSkill = (id) => {
    const updatedData = allSkillData?.map((el) =>
      el.id === id ? ({ ...el, isAdded: false }) : el
    );
    setAllSkillData([...updatedData]);
    setAddedSkillData(addedSkillData?.filter(el => el.id !== id))
    Toast.show({ text1: `Skill unselected successfully` });
  };
  const handleSelectSkill = (id) => {
    const updatedData = allSkillData?.map((el) =>
      el.id === id ? ({ ...el, isAdded: true }) : el
    );
    setAllSkillData([...updatedData]);
    const thatId = allSkillData.find(el => el.id == id)
    thatId.isAdded = true
    setAddedSkillData([...addedSkillData, thatId])
    Toast.show({ text1: `Skill selected successfully` });
  };
  const SelectedSkills = () => {
    // const data = addedSkillData?.filter((el) => el?.isAdded);
    return addedSkillData?.map((el) => {
      // console.log('skill el', el);
      return (
        <View
          style={[
            styles.skillTextView,
            !el?.isAdded ? { backgroundColor: "#D9E6F2" } : null,
          ]}
        >
          <Text
            style={[
              styles.skillText2,
              !el?.isAdded ? { color: "#0D0D26" } : null,
            ]}
          >
            {el.skill}
          </Text>
          {el?.isAdded ? (
            <TouchableOpacity
              onPress={() => {
                handleUnselectSkill(el.id);
              }}
              style={{ marginLeft: 8 }}
            >
              <Image source={require("./assets/images/jobs-cross-icon.png")} />
            </TouchableOpacity>
          ) : null}
        </View>
      );
    });
  };
  const UnselectedSkills = () => {
    // Saurabh Saneja 21 August 2023
    // filter data to include unselected skills, then filter for search text
    const data = getUnselectedSkills()
      ?.filter((el) =>
        el?.skill
          ?.trim()
          ?.toLowerCase()
          ?.includes(searchText?.trim()?.toLowerCase())
      );
    return data?.map((el) => {
      // console.log('skill el', el);
      return (
        <TouchableOpacity
          onPress={() => {
            handleSelectSkill(el.id);
          }}
          style={[
            styles.skillTextView,
            !el?.isAdded ? { backgroundColor: "#D9E6F2" } : null,
          ]}
        >
          <Text
            style={[
              styles.skillText2,
              !el?.isAdded ? { color: "#0D0D26" } : null,
            ]}
          >
            {el.skill}
          </Text>
          {el?.isAdded ? (
            <View style={{ marginLeft: 8 }}>
              <Image source={require("./assets/images/jobs-cross-icon.png")} />
            </View>
          ) : null}
        </TouchableOpacity>
      );
    });
  };
  const getUnselectedSkills = () => {
    const data = allSkillData?.filter(el => !addedSkillData?.find(jl => jl.id === el.id))
    console.log('getUnselectedSkills', data);
    return data
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Skills" />
        <View style={styles.mainView2}>
          <Text style={styles.title}>Add Skills</Text>

          <Search value={searchText} setValue={setSearchText} />
          <View style={styles.skillTextContainer}>
            {searchText?.length === 0 ? (
              addedSkillData?.filter((el) => el?.isAdded)?.length > 0 ? (
                <SelectedSkills />
              ) : (
                <Text>No selected skills found</Text>
              )
            ) : getUnselectedSkills()
                ?.filter((el) =>
                  el?.skill
                    ?.trim()
                    ?.toLowerCase()
                    ?.includes(searchText?.trim()?.toLowerCase())
                )?.length > 0 ? (
              <UnselectedSkills />
            ) : (
              <Text>No unselected skills match search text</Text>
            )}
          </View>
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
      {loading || loading2 ? <Loader /> : null}
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
export default AddSkills;

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
    marginBottom: 3,
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

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import HomeHeaderRoundBottom from "../../Deal/B2b/Homeheaderroundbottom";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import MyButtons from "../../../component/MyButtons";
import { dimensions, Mycolors } from "../../../utility/Mycolors";
import {
  add_movie,
  baseUrl,
  requestPostApi,
  requestPostApiMedia,
} from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import moment from "moment";
import { createThumbnail } from "react-native-create-thumbnail";
import Toast from "react-native-toast-message";
import MyAlert from "../../../component/MyAlert";
import Loader from "../../../WebApi/Loader";
import axios from "axios";

const UploadMovie = (props) => {
  const User = useSelector((state) => state.user.user_details);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDecs, setMovieDesc] = useState("");
  const [selectedTime, setselectedTime] = useState("1");
  const [pick, setpick] = useState({});
  const [thumbnail, setThumbnail] = useState("");
  const [filepath, setfilepath] = useState(null);
  const [upData, setupData] = useState([
    {
      id: "1",
      title: "Ambulance",
      type: "Action",
      desc: "6",
      time: "",
      img: require("../../../assets/images/Ambulance-image.png"),
    },
    {
      id: "2",
      title: "The Lost City",
      type: "Adventure",
      desc: "5.6",
      time: "",
      img: require("../../../assets/images/The-Lost-City-image.png"),
    },
    {
      id: "3",
      title: "Uncharted",
      type: "Comedy",
      desc: "9",
      time: "",
      img: require("../../../assets/images/Uncharted-image.png"),
    },
    {
      id: "4",
      title: "Ambulance",
      type: "Animation",
      desc: "4.9",
      time: "",
      img: require("../../../assets/images/Ambulance-image.png"),
    },
    {
      id: "5",
      title: "The Lost City",
      type: "7",
      desc: "2020 ∙ Petrol ∙ Manual ∙ 12,120 km",
      time: "",
      img: require("../../../assets/images/The-Lost-City-image.png"),
    },
  ]);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(
      'moment().format("YYYY-MM-DD hh:mm:ss")',
      moment().format("YYYY-MM-DD hh:mm:ss")
    );
  }, []);
  const openLibrary = async () => {
    let options = {
      title: "Select Video",
      mediaType: "video",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Photo from Custom Option",
        },
      ],
      //   maxWidth: 500,
      //   maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchImageLibrary(options, (image) => {
      if (!image.didCancel) {
        console.log("image", image);
        console.log("the ddd==", image.assets[0].uri);
        var photo = {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        };
        console.log("photo", photo);
        setpick(photo);
        setfilepath(image);
        generateThumb(photo?.uri);
        // Toast.show({ text1: "Video added successfully" });
      }
    });
  };
  const generateThumb = async (path) => {
    try {
      const thumb = await createThumbnail({
        url: path,
        timeStamp: 1000,
      });
      console.log("thumb", thumb);
      setThumbnail(thumb);
    } catch (error) {
      console.log("error creating thumbnail", error);
    }
  };
  const Validation = () => {
    if (movieTitle?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Movie Title" });
      return false;
    } else if (movieDecs?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Movie Description" });
      return false;
    } else if (typeof pick !== "object" || Object.keys(pick)?.length === 0) {
      Toast.show({ text1: "Please upload Movie" });
      return false;
    }
    return true;
  };
  const onUpload = async () => {
    if (!Validation()) {
      return;
    }
    setLoading(true);
    const formdata = new FormData();
    formdata.append("category_id", "1");
    formdata.append("name", movieTitle);
    formdata.append("uploaded_by", "user");
    formdata.append("published_date", moment().format("YYYY-MM-DD hh:mm:ss"));
    formdata.append("published_channel", "kids");
    formdata.append("description", movieDecs);
    formdata.append("duration", "2");
    formdata.append("files", { ...pick });
    formdata.append("image", {
      name: thumbnail.path.slice(
        thumbnail.path.lastIndexOf("/"),
        thumbnail.path.length
      ),
      uri: thumbnail.path,
      type: thumbnail.mime,
    });
    formdata.append("status", "1");
    console.log("onUpload formdata", formdata);
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${User.token}`,
    };
    const url = "http://54.153.75.225/backend/api/v1/talkie/movie";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formdata,
      });
      setLoading(false);
      const responseJson = await response.json();
      console.log("onUpload...............", responseJson);
      if (responseJson.headers.success == 1) {
        props.navigation.goBack();
        Toast.show({ text1: responseJson.headers.message });
      } else {
        Toast.show({ text1: responseJson.headers.message });
        setalert_sms(err);
        setMy_Alert(true);
      }
    } catch (error) {
      Toast.show({ text1: "Network type error" });
      console.log("Error uploading data:", error);
    }
    setLoading(false);
  };
  return (
    <SafeAreaView style={{}}>
      <ScrollView>
        <HomeHeaderRoundBottom
          height={80}
          paddingHorizontal={15}
          backgroundColor={"#FFD037"}
          press1={() => {
            props.navigation.goBack();
          }}
          img1={require("../../../assets/service-header-back-button.png")}
          img1width={25}
          img1height={18}
          borderBottomLeftRadius={20}
          borderBottomRightRadius={20}
          paddingBottom={6}
          press2={() => {}}
          title2={"Upload Movie"}
          fontWeight={"500"}
          img2height={20}
          color={"#fff"}
          fontSize={14}
          press3={() => {}}
          img3width={25}
          img3height={25}
        />

        <View style={{ width: "90%", alignSelf: "center" }}>
          <View
            style={{
              width: "96%",
              alignItems: "flex-start",
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#263238", fontSize: 18, fontWeight: "600" }}>
              Choose Category
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              marginHorizontal: 15,
              marginTop: 20,
            }}
          >
            <FlatList
              data={upData}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ width: 90, marginHorizontal: 5 }}>
                    <TouchableOpacity
                      style={{
                        width: 90,
                        height: 40,
                        justifyContent: "center",
                        borderWidth: 0.5,
                        borderRadius: 50,
                        borderColor: Mycolors.BG_COLOR,
                        backgroundColor:
                          selectedTime == item.id
                            ? "#FFD037"
                            : Mycolors.BG_COLOR,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowRadius: 1,
                        shadowOpacity: 0.03,
                        elevation: 1,
                      }}
                      onPress={() => {
                        setselectedTime(item.id);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color:
                            selectedTime == item.id
                              ? Mycolors.BG_COLOR
                              : "#263238",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        {item.type}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              top: 10,
            }}
          >
            <View style={styles.BoxView}>
              <TextInput
                value={movieTitle}
                onChangeText={(text) => {
                  setMovieTitle(text);
                }}
                placeholder="Movie Title"
                placeholderTextColor={"#B2B7B9"}
                style={[styles.input, { width: "100%" }]}
                multiline
              />
            </View>

            <View
              style={{
                width: "93%",
                height: 100,
                borderRadius: 5,
                marginTop: 10,
                alignSelf: "center",
                backgroundColor: "#fff",
              }}
            >
              <TextInput
                value={movieDecs}
                textAlignVertical="top"
                onChangeText={(e) => setMovieDesc(e)}
                placeholder="Movie Description"
                placeholderTextColor="#bbbbbb"
                multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize="none"
                style={[styles.inputDesc]}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.uploadButtonView}
            onPress={() => {
              openLibrary();
            }}
          >
            <Image
              source={require("../../../assets/upload-button-black.png")}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#263238",
                marginLeft: 10,
              }}
            >
              {typeof pick === "object" && Object.keys(pick)?.length === 0
                ? "Upload"
                : "Change"}{" "}
              Movie
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 190 }} />
      </ScrollView>
      <View
        style={{
          width: "85%",
          height: 60,
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
          zIndex: 999,
        }}
      >
        <MyButtons
          title="Save"
          height={50}
          width={"100%"}
          borderRadius={5}
          press={onUpload}
          fontSize={13}
          titlecolor={Mycolors.BG_COLOR}
          marginVertical={0}
          backgroundColor={"#FFD037"}
        />
      </View>
      {/* <View style={{ width: '95%', height: 60, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 5, alignSelf: 'center' }}>
        <View style={{ width: '47%' }}>
          <MyButtons title="Dining & Booked Table" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={() => { }} marginHorizontal={20} fontSize={11}
            titlecolor={Mycolors.BG_COLOR} hLinearColor={['#fd001f', '#b10027']} />
        </View>

        <View style={{ width: '47%' }}>
          <MyButtons title="My Orders" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={() => { props.navigation.navigate('ShopMyOrder') }} marginHorizontal={20} fontSize={11}
            titlecolor={Mycolors.BG_COLOR} hLinearColor={['#000000', '#000000']} />

        </View>

      </View> */}
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
const styles = StyleSheet.create({
  VideoThumbWrapper: {
    position: "relative",
    // width: '48%',
    // marginRight: 8,
    marginBottom: 4,

    width: dimensions.SCREEN_WIDTH / 2.3,
    height: 190,
    marginRight: 16,
    borderRadius: 15,
    // shadowColor:'#000',
    // shadowOffset: {width: 0,height: 3},
    // shadowRadius: 1,
    // shadowOpacity: 0.03,
    // elevation: 1,
  },
  PlayIconContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  PlayIconWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  BackGroundImage: {
    backgroundColor: "gray",
    width: "100%",
    height: 190,
    justifyContent: "center",
    borderRadius: 15,
  },
  BoxView: {
    marginTop: 15,
    width: "93%",
    backgroundColor: "#fff",
    // padding:15,
    // flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "center",
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 1,
    // shadowOpacity: 0.3,
    // elevation: 5,
  },
  input: {
    paddingLeft: 20,
    fontSize: 13,
    fontWeight: "400",
    color: "#000",
  },
  inputDesc: {
    paddingLeft: 20,
    textAlign: "left",
    width: "100%",
    fontSize: 13,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 0.5,
    // backgroundColor: '#34333a',
    color: "#fff",
    height: 100,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Mycolors.Black,
  },
  uploadButtonView: {
    marginTop: 30,
    height: 50,
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#263238",
    borderStyle: "dashed",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 5,
  },
});

export default UploadMovie;

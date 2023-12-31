import React, { useEffect, useFocusEffect, useState, useRef } from 'react';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import { driver_reviews, cancelOrders, shop_eat_orders, requestPostApi, requestGetApi, shop_product_orders } from '../../../WebApi/Service'
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-toast-message';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { RefreshControl, View, Image, Text, Platform, Linking, BackHandler, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyAlert from '../../../component/MyAlert';
// 
const ShopMyOrder = (props) => {
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [drvReviewData, setdrvReviewData] = useState('')
  const [drv_Review, setdrv_Review] = useState('')
  const [searchValue, setsearchValue] = useState('')
  const [modlevisual1, setmodlevisual1] = useState(false)
  const [modlevisual2, setmodlevisual2] = useState(false)
  const [checkitem, setcheckitem] = useState('')
  const [reson, setreson] = useState(' ')
  const [date, setDate] = useState('')
  const User = useSelector(state => state.user.user_details)
  const [drvRating, setdrvRating] = useState('0')
  const [upData, setupData] = useState([
    {
      id: '1',
      title: 'Dining',
      desc: 'Order placed by mistake',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '2',
      title: 'Table',
      desc: 'Food preparation time was to late',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    // {
    //   id: '3',
    //   title: 'Dining',
    //   desc:'Restaurant manager behaviour was not good',
    //   time:'',
    //   img:require('../../../assets/images/images.png'),
    // },
    {
      id: '4',
      title: 'Table',
      desc: 'Changed my mind',
      time: '',
      img: require('../../../assets/images/images.png'),
    },

  ])
  const [loading, setLoading] = useState(false)
  const [orderData, setorderData] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [cancleitem, setcancleitem] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [orderTypeValue, setOrderTypeValue] = useState('');
  const [orderTypeData, setOrderTypeData] = useState([
    // {label: 'Dining', value: 'dining'},
    // { label: 'Delivery', value: 'delivery' },
    // {label: 'Table Booking', value: 'booked-table'},
    { label: 'Take Away', value: 'takeaway' },
  ]);
  const [timeDurationValue, setTimeDurationValue] = useState('');
  const [timeDurationData, setTimeDurationData] = useState([
    { label: 'Today', value: 'Today' },
    { label: '30 days', value: '30 day' },
    { label: '60 days', value: '60 day' },
    { label: '120 days', value: '120 day' },
    { label: 'Last Year', value: 'Last Year' },
    { label: 'Last 3 Years', value: 'Last 3 Years' },
  ]);
  const [orderDate, setOrderDate] = useState('')
  const [showOrderDate, setShowOrderDate] = useState(false)
  const [statusValue, setStatusValue] = useState('');
  const [statusData, setStatusData] = useState([
    { label: 'Pending', value: '0' },
    // { label: 'Accepted', value: '1' },
    // { label: 'Rejected', value: '2' },
    { label: 'Preparing', value: '3' },
    // { label: 'Cancelled', value: '6' },
    { label: 'Delivered', value: '12' },
  ]);
  const [showda, setshowda] = useState(false)
  const [keyword, setKeyword] = useState('');
  const [relode, setrelode] = useState(false)
  const [ordersFound, setOrdersFound] = useState(true)
  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, [])
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      myorderList()
      // remove filter and search
      setKeyword('')
      setOrderDate('')
      setShowOrderDate('')
    })
    return unsubscribe;
  }, [props.navigation])

  useEffect(() => {
    console.log('showOrderDate changed', showOrderDate);
  }, [showOrderDate])

  const handleBackButton = () => {
    // Toast.show({text1: 'Back button is pressed'});
    return true;
  }

  const checkcon = () => {
    myorderList()
    resetFilter()
  }
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    // fetchSuccessDetails()
    checkcon()
    wait(2000).then(() => {

      setRefreshing(false)

    });
  }, []);

  const dialCall = (number) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:' + number;
    }
    else {
      phoneNumber = 'telprompt:${' + number + '}';
    }
    Linking.openURL(phoneNumber);
  };

  const cancleOrder = async () => {

    setLoading(true)
    var data = {
      notes: reson,
    }
    const { responseJson, err } = await requestPostApi(cancelOrders + '/' + cancleitem.id + '/cancel', data, 'POST', User.token)
    setLoading(false)
    console.log('the res shop_eat_orders cancle==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        myorderList()
        Toast.show(responseJson.headers.message)
        setmodlevisual1(false)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const dateformates = (month, day, year) => {
    if (month == 'Jan') {
      return year + '-01-' + day
    } else if (month == 'Feb') {
      return year + '-02-' + day
    } else if (month == 'Mar') {
      return year + '-03-' + day
    } else if (month == 'Apr') {
      return year + '-04-' + day
    } else if (month == 'May') {
      return year + '-05-' + day
    } else if (month == 'Jun') {
      return year + '-06-' + day
    } else if (month == 'Jul') {
      return year + '-07-' + day
    } else if (month == 'Aug') {
      return year + '-08-' + day
    } else if (month == 'Sep') {
      return year + '-09-' + day
    } else if (month == 'Oct') {
      return year + '-10-' + day
    } else if (month == 'Nov') {
      return year + '-11-' + day
    } else if (month == 'Dec') {
      return year + '-12-' + day
    }
  }
  const myorderList = async () => {
    let endPoint = shop_product_orders

    console.log(' endPoint', endPoint);
    // return
    setLoading(true)

    const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', User.token)
    setLoading(false)
    console.log('the res shop_product_orders ==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        setorderData(responseJson.body)
        console.log('responseJson.body?.length == 0', responseJson.body?.length == 0);
        if (responseJson.body?.length == 0) {
          setOrdersFound(false)
        } else {
          setOrdersFound(true)
        }
      } else {
        setOrdersFound(false)
        setorderData(null)
        setrelode(!relode)
        Toast.show({ text1: responseJson.headers.message })
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }
  const orderList = async (filters = false, closeModal = false) => {
    setShowOrderDate(true)
    let endPoint = shop_product_orders
    if (filters && timeDurationValue !== '' || orderDate !== '' || keyword !== '' || statusValue !== '') {
      const data = {}
      if (timeDurationValue !== '') {
        data['from_date'] = timeDurationData.find(el => el.label === timeDurationValue).value
      }
      if (orderDate !== '') {
        var m = orderDate.toString().substring(4, 7)
        var d = orderDate.toString().substring(8, 10)
        var y = orderDate.toString().substring(11, 15)
        console.log(m);
        console.log(d);
        console.log(y);
        data['order_date'] = dateformates(m, d, y)
      }
      if (keyword !== '') {
        data['keyword'] = keyword
      }
      if (statusValue !== '') {
        data['status'] = statusData.find(el => el.label === statusValue).value
      }
      if (Object.keys(data)?.length > 0) {
        endPoint += '?'
      }
      for (const [key, value] of Object.entries(data)) {
        if (endPoint?.includes('=')) {
          endPoint += `&${key}=${value}`
        } else {
          endPoint += `${key}=${value}`
        }
        console.log(`${key}: ${value}`);
      }
      setLoading(true)
      console.log(' endPoint', endPoint);
      const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', User.token)
      setLoading(false)
      // console.log('the res shop_eat_orders ==>>', responseJson.body[0].items)
      if (responseJson !== null) {
        if (responseJson.headers.success == 1) {
          setorderData(responseJson.body)
          setShowFiltersModal(false)
        } else {
          setorderData(null)
          setShowFiltersModal(false)
          // setShowFiltersModal(false)
          Toast.show({ text1: responseJson.headers.message })
          //  setalert_sms(err) 
          //  setMy_Alert(true)
        }
      } else {
        setalert_sms(err)
        setMy_Alert(true)
      }

      // if (filters || closeModal) {
      //   setShowFiltersModal(false)
      // }
    } else {
      Toast.show({ text1: 'Please select one of the filter first.' })
    }



  }
  const resetFilter = () => {
    setKeyword('')
    // setOrderTypeValue('')
    setTimeDurationValue('')
    setOrderDate('')
    setShowOrderDate(false)
    setStatusValue('')
    // orderList(false, true)
    myorderList()
    setShowFiltersModal(false)
  }

  const design = (img, ti, tit, w, imgh, imgw, bg, redious) => {
    return (
      <View style={{ flexDirection: 'row', width: w, marginTop: 10, backgroundColor: Mycolors.TimingColor, paddingVertical: 20, borderRadius: 10, alignSelf: 'center', paddingHorizontal: 10 }}>
        {/* <View style={{ width: 40, height: 40, backgroundColor: bg, justifyContent: 'center', borderRadius: redious }}> */}
        <Image source={img} style={{ width: imgw, height: imgh, alignSelf: 'center' }}></Image>
        {/* </View> */}
        <View style={{ marginLeft: 15, width: '80%' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black }}>{ti}</Text>
          <Text style={{ fontSize: 12, color: Mycolors.GrayColor, top: 3, lineHeight: 18 }}>{tit}</Text>
        </View>

      </View>
    )
  }

  const cancleDesign = (title, press, check) => {
    return (
      <TouchableOpacity style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', borderRadius: 7, borderColor: check ? '#835E23' : Mycolors.GrayColor, borderWidth: 0.5, paddingHorizontal: 10, marginTop: 10 }}
        onPress={press}>
        <View style={{ width: 25, height: 25, borderColor: check ? '#835E23' : Mycolors.GrayColor, borderWidth: 0.3, justifyContent: 'center', borderRadius: 20, }}>
          {check ?
            <View style={{ width: 15, height: 15, borderRadius: 15, backgroundColor: '#835E23', alignSelf: 'center' }} />
            : null
          }
        </View>
        <View>
          <Text style={{ color: Mycolors.Black, fontSize: 13, marginLeft: 10, fontWeight: '300' }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <HomeHeader height={60} paddingHorizontal={15}// backgroundColor={'#fff'}
          // press1={() => { props.navigation.goBack() }}
          press1={() => { props.navigation.navigate('ShopProduct') }}
          img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
          press2={() => { }} title2={'My Orders'} fontWeight={'500'} img2height={20}
          press3={() => { }} img3width={25} img3height={25} />
        {/* {
          orderData != null ?
            <TouchableOpacity onPress={() => { setShowFiltersModal(true) }} style={[styles.iconView, {}]}>
              <AntDesign name="filter" color={'#fff'} size={24} />
            </TouchableOpacity>
            :
            null
        } */}
        {
          orderData != null ?
            <TouchableOpacity onPress={() => { setShowFiltersModal(true) }} style={{
              width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              marginVertical: 10, backgroundColor: '#fff', padding: 5, borderRadius: 10,
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 10
              },
              shadowRadius: 10,
              shadowOpacity: 0.9,
              overflow: 'hidden',
              elevation: 5, marginHorizontal: 18
            }}>
              {/* <View
                // onPress={() => { setShowFiltersModal(true) }} 
                style={styles.iconView}>
                <AntDesign name="filter" color={'#fff'} size={24} />
              </View> */}
              {
                orderTypeValue != '' || showOrderDate != '' ?
                  (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {
                      orderTypeValue != '' ?
                        <View style={{ paddingHorizontal: 15, justifyContent: 'center', borderRadius: 10, backgroundColor: '#ADC430', borderColor: Mycolors.GrayColor, borderWidth: 0.2, height: 30, marginLeft: 15 }}>

                          <Text style={{ color: Mycolors.Black, fontSize: 11, textAlign: 'center', lineHeight: 22 }}>{orderTypeValue}</Text>
                        </View> : null
                    }
                    {
                      showOrderDate != '' ?
                        <View style={{ paddingHorizontal: 15, justifyContent: 'center', borderRadius: 10, backgroundColor: '#ADC430', borderColor: Mycolors.GrayColor, borderWidth: 0.2, height: 30, marginLeft: 15 }}>
                          <Text style={{ color: Mycolors.Black, fontSize: 11, textAlign: 'center', lineHeight: 22 }}>{orderDate && showOrderDate ? orderDate.toString().substring(0, 16) : 'Select Date'}</Text>
                        </View>
                        :
                        null
                    }
                  </View>

                  )
                  :
                  <Text style={{ color: 'gray', fontSize: 14, left: 12 }}>Select Filter</Text>
              }
              <View
                // onPress={() => { setShowFiltersModal(true) }} 
                style={styles.iconView}>
                <AntDesign name="filter" color={'#fff'} size={24} />
              </View>


            </TouchableOpacity>

            :
            null
        }

        <View style={{ width: '90%', alignSelf: 'center' }}>

          {orderData != null ?
            orderData.map((item, index) => {
              return (

                <>
                  {item.order_type == 'takeaway' ?
                    <View style={{
                      marginVertical: 15, backgroundColor: '#ffff', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15, shadowColor: 'black',
                      shadowOffset: {
                        width: 0,
                        height: 10
                      },
                      shadowRadius: 10,
                      shadowOpacity: 0.9,
                      overflow: 'hidden',
                      elevation: 5,
                      // borderColor: 'rgba(0,0,0,0.2)', borderWidth: 0.5
                    }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14 }}>{item.business_name}</Text>

                        <View style={{ paddingHorizontal: 10, justifyContent: 'center', borderRadius: 10, backgroundColor: '#ADC430', borderColor: Mycolors.GrayColor, borderWidth: 0.2 }}>
                          <Text style={{ color: Mycolors.Black, fontSize: 11, textAlign: 'center', lineHeight: 22 }}>{'Take Away'}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#835E23', fontWeight: '400', fontSize: 12, marginTop: 5 }}>Order ID : #{item.id}</Text>
                        <Text style={{ color: Mycolors.GrayColor, fontWeight: '400', fontSize: 12, marginTop: 5, left: 10 }}>Placed At : {item.created_date}</Text>
                      </View>
                      {item.order_type != 'booked-table' ?
                        <>

                          <TouchableOpacity style={{
                            width: '100%',
                            //  height: 120, 
                            padding: 10,
                            marginVertical: 5,
                            backgroundColor: '#D4F9FA',
                            //  borderColor: '#dee4ec',
                            elevation: 3,
                            borderRadius: 10,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                            onPress={() => {
                              // if (item.status != 0 && item.status != 2) {
                              //   props.navigation.navigate('ShopMyOrderDetails', { data: item })
                              // }
                              props.navigation.navigate('ShopMyOrderDetails', { data: item })
                            }}>
                            <View style={{ width: 110, height: 110, alignSelf: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#dee4ec', }}>
                              <Image source={{ uri: item.banner_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
                            </View>
                            <View style={{ marginLeft: 15, width: '55%' }}>
                              {
                                item.items.map((sitem, index) => {
                                  return (
                                    <View style={{ flexDirection: 'row', top: -6, marginTop: 4, }}>
                                      <Text numberOfLines={2} style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 13, }} >{sitem.quantity}</Text>
                                      <Text numberOfLines={2} style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 13, }} > X {sitem.product_name} </Text>
                                    </View>
                                  )
                                })}
                              <Text style={{ color: Mycolors.Black, fontWeight: '400', fontSize: 12, }} >Total Amount - ${item.paid_amount}</Text>

                              <View style={{ width: 120, marginTop: 4 }}>
                                <MyButtons title="Call Vendor" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={() => { dialCall(item.business_phone) }} marginHorizontal={20} fontSize={11}
                                  titlecolor={'#835E23'} backgroundColor={'transparent'} marginVertical={0} borderColor={'#835E23'} borderWidth={0.4} />
                              </View>

                            </View>
                          </TouchableOpacity>

                        </>
                        :
                        null
                      }
                      <View style={{ borderColor: Mycolors.GrayColor, borderWidth: 1, borderStyle: 'dashed', marginTop: 8 }} />

                      {design(require('../../../assets/product_order_status.png'), 'Order Status', item.status_label, '100%', 42, 42, 'red', 20)}

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'center', marginTop: 15 }}>


                        {item.order_type == 'takeaway' && item.business_rating == null && item.status == 5 ?
                          <MyButtons title="Rate Vendor" height={45} width={'47%'} borderRadius={5} alignSelf="center" press={() => {
                            if (item.business_rating == null) {
                              props.navigation.navigate('ShopReview', { data: item, from: 'myOrder' })
                            }
                          }} fontSize={12}
                            titlecolor={Mycolors.Black} backgroundColor={'transparent'} marginVertical={0} borderColor={'#ADC430'} borderWidth={1} />
                          : null
                        }


                      </View>
                      <View style={{ flexDirection: item.business_rating == null ? 'row' : 'column', width: '100%', justifyContent: 'space-between' }}>
                        {item.business_rating != null ?
                          <View style={{ paddingHorizontal: 5, backgroundColor: '#fff', alignItems: 'flex-start', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13, color: '#000', marginRight: 5 }}>Rated</Text>
                            <Text style={{ fontSize: 13, color: '#000', marginRight: 5, fontWeight: 'bold' }}> {item.business_name}</Text>
                            <Rating
                              type='custom'
                              ratingCount={5}
                              imageSize={16}
                              startingValue={item.business_rating}
                              // style={{alignSelf:'flex-start',backgroundColor:'red'}}
                              readonly={true}
                            />
                          </View>
                          :
                          null
                        }
                      </View>

                    </View>
                    :
                    null
                  }
                </>
              )
            }
            )
            :

            <View style={{ width: '100%', justifyContent: 'center', height: '100%', marginHorizontal: 'auto' }}>
              <View style={{ width: 220, height: 220, alignSelf: 'center', }}>
                <Image source={require('../../../assets/Shop-eat-empty-cat-image.png')} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
              </View>
              <View style={{ width: '100%', marginTop: 25, }}>

                <Text style={{ color: '#ADC430', textAlign: 'center', fontWeight: 'bold', fontSize: 25 }}>No Orders Found</Text>
                {ordersFound ?
                  <Text style={{ color: '#000000', textAlign: 'center', fontSize: 14 }}>Looks like you have no orders in the selected time. </Text>
                  : null}

                {ordersFound ?
                  <View style={{ width: '40%', alignSelf: 'center', marginTop: 10 }}>
                    <MyButtons title="View all orders" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => { resetFilter() }} marginHorizontal={20} fontSize={14}
                      titlecolor={Mycolors.BG_COLOR} backgroundColor={'#835E23'} marginVertical={0} />
                  </View>
                  : null}
              </View>

            </View>

          }



        </View>
        <View style={{ height: 100 }} />
      </ScrollView>


      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model1 Cancle Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
      <Modal
        isVisible={modlevisual1}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual1(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >

        <View style={{ height: '70%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, }}>
          <View style={{ width: '100%', height: 50, backgroundColor: Mycolors.TimingColor, borderTopLeftRadius: 30, borderTopRightRadius: 30, justifyContent: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 5, color: Mycolors.Black, textAlign: 'center' }}>Cancel Order</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 10 }} >Select Specific reason for cancel order</Text>
            <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
              {
                upData.map((item, index) => {
                  return (
                    <View>
                      {cancleDesign(item.desc, () => { setcheckitem(item) }, checkitem == item ? true : false)}

                    </View>
                  )
                }
                )
              }
            </View>
            <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 20, color: Mycolors.Black, }}>Other Reason</Text>

            <View style={{ width: '100%', height: 100, borderRadius: 2, marginTop: 10, alignSelf: 'center' }}>
              <TextInput
                value={reson}
                onChangeText={(e) => setreson(e)}
                placeholder={'Type here'}
                placeholderTextColor="#bbbbbb"
                multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize='none'
                style={[styles.input]}
              />

            </View>

            <View style={{ width: '100%' }}>
              <MyButtons title="Cancel order" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => { cancleOrder() }} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} hLinearColor={['#b10027', '#fd001f']} />
            </View>

            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: Mycolors.TimingColor, borderRadius: 5, padding: 10 }}>
              <View style={{ width: 22, height: 22, backgroundColor: '#835E23', borderRadius: 20, justifyContent: 'center' }}>
                <Image source={require('../../../assets/info.png')} style={{ width: 13, height: 13, alignSelf: 'center' }}></Image>
              </View>
              <View style={{ marginLeft: 10, width: '80%' }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '300', fontSize: 12, lineHeight: 14, fontStyle: 'italic' }}>Note: Cancellation fees of $5.00 for courier's time
                  might apply if 10 minutes had elapsed since your
                  order was placed.</Text>
              </View>
            </View>

            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>
        {loading ? <Loader /> : null}
      </Modal>

      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model1 Submit Driver Review Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model1 showFiltersModal Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}

      <Modal
        isVisible={showFiltersModal}
        swipeDirection="down"
        onBackdropPress={() => setShowFiltersModal(false)}
        onSwipeComplete={(e) => {
          setShowFiltersModal(false)
        }}
        onModalWillShow={() => {
          if (!showOrderDate) {
            setOrderDate('')
          }
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '60%', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, marginTop: 5 }}>
              <Text style={{ color: Mycolors.Black, fontWeight: '500', }}></Text>
              <Text style={{ color: Mycolors.Black, fontWeight: '500', fontSize: 22 }}>Filter</Text>
              <TouchableOpacity onPress={() => { setShowFiltersModal(false) }}>
                <Image source={require('../../../assets/product_X.png')} style={{ width: 24, height: 24, alignSelf: 'center', top: -8 }}></Image>
              </TouchableOpacity>

            </View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

              {/* <View style={{ width: '100%', height: 100, borderRadius: 2, marginTop: 10, alignSelf: 'center' }}> */}
              {/* <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5 }}>Keyword</Text>
              <TextInput
                value={keyword}
                onChangeText={(e) => setKeyword(e)}
                placeholder={'Type Keyword'}
                placeholderTextColor="#bbbbbb"
                // multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize='none'
                style={[styles.input, {height:50}]}
              /> */}

              {/* </View> */}

              <Text style={{ fontSize: 16, fontWeight: '500', color: Mycolors.Black, marginTop: 10, marginBottom: 5 }}>Order Date</Text>
              <View style={{
                width: '100%', alignSelf: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between',
                //  borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 0.2,
                borderColor: '#E0E0E0', borderWidth: 1
              }}>
                <View style={{}}>
                  {Platform.OS == 'ios' ?
                    <DatePicker
                      customStyles={{
                        dateInput: { borderColor: 'transparent', },
                        dateText: { color: Mycolors.GrayColor },
                        dateIcon: styles.dateIcon,
                        dateplaceholder: {
                          alignContent: 'flex-start',
                        },
                        placeholderText: {
                          fontSize: 10,
                          color: Mycolors.GrayColor,
                          //marginLeft: '1%',
                          left: -5
                        },
                        zIndex: 99999
                      }}
                      showIcon={false}
                      androidMode={'spinner'}
                      readOnly={true}
                      style={[styles.datePickerSelectInput, { fontSize: 11, color: Mycolors.GrayColor, left: 15 }]}
                      date={orderDate}
                      mode="date"
                      placeholder={'Pick a Date'}
                      // maximumDate={new Date()}
                      format='YYYY-MM-DD'
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      //iconSource={require ('../../../assets/shape_38.png')}
                      onDateChange={date => {
                        setOrderDate(date)
                      }}
                    />
                    :
                    showda ?
                      <View>
                        <DateTimePicker
                          value={new Date()}
                          mode='calendar'
                          // is24Hour={false}
                          display="spinner"
                          // maximumDate={new Date()}
                          onChange={(event, sTime) => {
                            setshowda(false)
                            console.log(sTime.toDateString());
                            setOrderDate(sTime)
                            console.log(event);
                          }}
                        />
                      </View>
                      :
                      <TouchableOpacity style={{ width: '100%', height: 50, justifyContent: 'center', backgroundColor: Mycolors.HEADERCOLOR, borderColor: 'transparent', zIndex: -999, borderRadius: 5 }}>
                        <Text style={{ fontSize: 15, color: '#000', left: 10 }} onPress={() => { setshowda(true) }}>{orderDate ? orderDate.toString().substring(0, 16) : 'Select Date'}</Text>
                      </TouchableOpacity>
                  }
                </View>
                <View style={{ justifyContent: 'center', marginRight: 9 }}>
                  <Image source={require('../../../assets/calendarB.png')} style={{ width: 24, height: 24, alignSelf: 'center' }}></Image>
                </View>

              </View>


              {/* <Text style={{ fontSize: 16, fontWeight: '500', color: Mycolors.Black, marginTop: 10, marginBottom: 5 }}>Order Type</Text>
              <FlatList
                data={orderTypeData}
                
                keyExtractor={item => item.label}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableWithoutFeedback onPress={() => { setOrderTypeValue(item.label) }}>

                      <View style={[styles.radioButtonContainer, { width: '50%' }]}>
                        <MaterialCommunityIcons name={item.label === orderTypeValue ? "checkbox-intermediate" : "checkbox-blank-outline"} color={'#ADC430'} size={24} />
                        <Text style={{ color: '#455A64', fontWeight: '600', fontSize: 14, marginLeft: 6 }} >{item.label}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              /> */}

              {/* <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5  }}>Time Duration</Text>
  <FlatList
    data={timeDurationData}
      numColumns={2}
      keyExtractor={item => item.label}
    renderItem={({item, index}) => {
      return (
        <TouchableWithoutFeedback onPress={()=>{setTimeDurationValue(item.label)}}>
          
        <View style={[styles.radioButtonContainer, {width:'50%'}]}>
        <MaterialCommunityIcons name={item.label === timeDurationValue ? "radiobox-marked":"radiobox-blank"} color={'#835E23'} size={24} />
        <Text style={{ color: '#835E23', fontWeight: '600', fontSize: 12, marginLeft:5}} >{item.label}</Text>
      </View>
        </TouchableWithoutFeedback>
      );
    }}
  /> */}

              {/* <Text style={{ fontSize: 16, fontWeight: '500', color: Mycolors.Black, marginTop: 10, marginBottom: 5 }}>Status</Text>
              <FlatList
                data={statusData}
                
                keyExtractor={item => item.label}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableWithoutFeedback onPress={() => { setStatusValue(item.label) }}>

                      <View style={[styles.radioButtonContainer, { width: '50%' }]}>
                        <MaterialCommunityIcons name={item.label === statusValue ? "checkbox-intermediate" : "checkbox-blank-outline"} color={'#ADC430'} size={24} />
                        <Text style={{ color: '#455A64', fontWeight: '600', fontSize: 14, marginLeft: 6 }} >{item.label}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              /> */}

              <View style={{ height: 20, }} />

              <MyButtons title="Submit" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={() => { orderList(true) }} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN} />
              <MyButtons title="Reset" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={resetFilter} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={'#835E23'} />
              <View style={{ height: 20, }} />
            </KeyboardAvoidingView>
          </ScrollView>

        </View>
        {loading ? <Loader /> : null}
      </Modal>

      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    paddingLeft: 15,
    width: '100%',
    fontSize: 13,
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 0.5,
    // backgroundColor: '#34333a',
    color: '#fff',
    height: 80,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Mycolors.Black
  },
  // datePickerSelectInput:{
  //   height: 45,
  //   width:'100%',
  //   fontSize: 15,
  //   borderColor: null,
  // //  backgroundColor: '#fff',
  //   borderRadius:10,
  //   color:Mycolors.GrayColor,
  // },
  iconView: {
    height: 40,
    width: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#835E23',
    width: '15%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  }
});
export default ShopMyOrder
import React from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Keyboard, StyleSheet } from 'react-native'
import { Mycolors } from '../../../../utility/Mycolors'
import AntDesign from 'react-native-vector-icons/AntDesign';

const ProductSearchInput = (props) => {
    return (

        <View style={{
            width: '98%', height: 45, backgroundColor: '#fff', alignSelf: 'center', flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 3
            },
            shadowRadius: 1,
            shadowOpacity: 0.3,
            // justifyContent: 'center',
            elevation: 5,
            borderRadius: 10,
            alignSelf: 'center', marginTop: props.marginTop ? props.marginTop : 'auto'
        }}>
            <View style={{ width: '100%', height: 45, backgroundColor: Mycolors.BG_COLOR, borderRadius: 8 }}>

                <View style={{
                    width: '98%', height: 45, borderRadius: 8, backgroundColor: Mycolors.LogininputBox, alignSelf: 'center', justifyContent: 'space-between', flexDirection: 'row'
                    //  shadowColor: '#000',
                    //  shadowOffset: {
                    //    width: 0,
                    //    height: 3
                    //  },
                    //  shadowRadius: 1,
                    //  shadowOpacity: 0.3,
                    //  justifyContent: 'center',
                    //  elevation: 5,
                }}>
                    <TextInput
                        style={[styles.input, { paddingLeft: props.paddingLeft ? props.paddingLeft : 5 }]}
                        // maxLength={ props.multiline ? 1000 : 40}
                        value={props.serchValue}
                        autoCapitalize={props.autoCapitalize}
                        numberOfLines={1}
                        //   onFocus={() =>  props.onFocus ?  props.onFocus() :  setState({isFocus:true})}
                        //   onBlur={() =>  props.onBlur ?  props.onBlur() :  setState({isFocus:false})}
                        ref={props.inputRef}
                        secureTextEntry={props.passwordType ? props.passwordType : false}
                        blurOnSubmit={props.blurOnSubmit}
                        keyboardType={props.keyboardType}
                        returnKeyType={props.returnKeyType}
                        placeholder={props.placeholder}
                        textContentType={props.textContentType}
                        onSubmitEditing={props.multiline ? null : Keyboard.dismiss}
                        // placeholderTextColor={Mycolors.placeholderTextColor}
                        placeholderTextColor={'gray'}
                        onChangeText={props.onChangeText ? (text) => props.onChangeText({ text }) : () => { }}
                        editable={props.editable}
                        multiline={props.multiline}
                    />
                    <View style={{ height: 38, backgroundColor: 'transparent', borderRadius: 8, left: -35, alignSelf: 'center' }}>
                        <TouchableOpacity style={{
                            width: 38, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#835E23'
                        }}
                            onPress={props.presssearch}>
                            {props.isCustomSearchIcon ?
                                props.customSearchIcon
                                :
                                <AntDesign name="search1" color={'#FFF'} size={24} style={{ alignSelf: 'center' }} />
                            }
                            {/* <Image source={require('../../../assets/Search-red.png')} style={{ width: 45, height: 48, overflow: 'hidden', alignSelf: 'center', right: 3 }}></Image> */}
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            {/* <View style={{width:'14%',height:45,backgroundColor:'transparent',borderRadius:8,left:5,}}>
    <TouchableOpacity style={{width:45,height:45,justifyContent:'center',backgroundColor:Mycolors.LogininputBox,borderRadius:8}}
    onPress={props.press}>
    <Image source={require('../assets/shape_32.png')} style={{ width: 18, height: 18, alignSelf: 'center'}}></Image>
    </TouchableOpacity>

</View> */}
        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Mycolors.BG_COLOR
    },
    input: {
        paddingRight: 10,
        height: 45,
        width: '100%',
        fontSize: 13,
        // borderColor: Mycolors.GrayColor,
        // borderWidth:1,
        backgroundColor: Mycolors.LogininputBox,
        borderRadius: 15,
        color: Mycolors.TEXT_COLOR,
        //   textAlignVertical: 'top',
    },
});
export default ProductSearchInput;










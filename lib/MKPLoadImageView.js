/**
 * Created by yzw on 16/9/26.
 */


import React, { Component} from 'react';
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';


export default class MKPLoadImageView extends Component {


    static propTypes() {
        return {
            ...Image.propTypes,
            backImageSource:PropTypes.func,
            imageSource:PropTypes.func,
            style:PropTypes.object,
            clickHandle:PropTypes.func,
            showLoading:PropTypes.bool,
            showProgress:PropTypes.bool,
            progressStyle:PropTypes.object,
            data:PropTypes.any
        };
    }

    static defaultProps = {

        style:{backgroundColor:'white'}
    };



    constructor(props) {
        super(props);
        this.state = {
            animating:props.imageSource?true:false,
            backImageSource:props.backImageSource?props.backImageSource:require('../assets/icon.png'),
            imageSource:props.imageSource?props.imageSource:require('../assets/icon.png'),
        }
    }

    componentWillMount(){


    }


    componentWillReceiveProps(nextProps) {
        let newState = Object.assign({}, this.state);
        if(nextProps.backImageSource){
            newState.backImageSource = nextProps.backImageSource;
        }
        if(nextProps.imageSource){
            newState.imageSource = nextProps.imageSource;
            newState.animating = true;
        }
        else {
            newState.animating = false;
        }

        this.setState(newState);
    }


    clickHandle(){
        if(this.props.clickHandle){
            this.props.clickHandle(this.props.data)
        }
    }

    render() {

        let props = {};
        props.resizeMethod = this.props.resizeMethod;
        props.resizeMode = this.props.resizeMode;

        return  <TouchableOpacity {...props} activeOpacity={this.props.clickHandle?0.3:1} onPress={this.clickHandle.bind(this)} >

            <Image {...props}
                style={this.props.style}
                source={this.state.backImageSource}/>

            <Image {...props}
                style={[{position:'absolute',top:0,left:0},this.props.style]}
                source={this.state.imageSource}
                onLoadStart={()=>{
                               let newState = Object.assign({}, this.state);
                                newState.animating = true;
                                this.setState(newState);
            }}
                onLoadEnd={()=>{
                               let newState = Object.assign({}, this.state);
                                 newState.animating = false;
                                 newState.backImageSource = require('../assets/icon.png');
                                 this.setState(newState);
             }}>
            </Image>

            <ActivityIndicator size="small"
                               animating={this.state.animating}
                               style={[{position: "absolute", top: 0,bottom: 0,left: 0,right: 0},this.props.style]}
                               hidesWhenStopped={true} />

            <View style={[{position:'absolute',top:0,left:0},this.props.style]}>
                {this.props.children}
            </View>

        </TouchableOpacity>

    }



};

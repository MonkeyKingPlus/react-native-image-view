/**
 * Created by yzw on 2016/10/13.
 */
/**
 * Created by yzw on 16/9/26.
 */


import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    ProgressViewIOS,
    ProgressBarAndroid
} from 'react-native';

// import * as Progress from 'react-native-progress';
var PropTypes = require('react/lib/ReactPropTypes');


class ProgressBar extends Component {
    
    static propTypes = {
    progressProps: PropTypes.object,
    color:PropTypes.string,
    iosTrackTintColor:PropTypes.string,
    progress:PropTypes.number,
    }
    static defaultProps = {
    color:'gray',
    iosTrackTintColor:'gray',
    progress:0,
    };
    
    
    render() {
        
        if(Platform.OS === 'android'){
            return <ProgressBarAndroid color={this.props.color} progress={this.props.progress} {...this.props.progressProps}/>
        }
        else  if(Platform.OS === 'ios') {
            return <ProgressViewIOS  progressTintColor={this.props.color} trackTintColor={this.props.iosTrackTintColor}  progress={this.props.progress}  {...this.props.progressProps}/>
        }
    }
}

export default class MKPLoadImageView extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        animating: props.imageSource ? true : false,
        defaultImageSource: props.defaultImageSource ? props.defaultImageSource : require('../assets/icon.png'),
        imageSource: props.imageSource ? props.imageSource : require('../assets/icon.png'),
        }
    }
    
    static propTypes = {
        ...Image.propTypes,
    defaultImageSource: PropTypes.number,
    imageSource: PropTypes.object,
    style: PropTypes.object,
    onPress: PropTypes.func,
    customIndicator: PropTypes.func,
    indicatorType:PropTypes.oneOf(['circle','line']),//默认是circle类型
    indicatorProps: PropTypes.object,
    data: PropTypes.any ,//点击事件，数据传输
    loadCallBack:PropTypes.func,
    hiddenProgress:PropTypes.bool,
    }
    
    static defaultProps = {
    progress:0,
    hiddenProgress:false,
    showLoading: true,
    indicatorType:'circle',
    style: {backgroundColor: 'white'}
    };
    
    componentWillReceiveProps(nextProps) {
        let newState = Object.assign({}, this.state);
        if (nextProps.defaultImageSource) {
            newState.defaultImageSource = nextProps.defaultImageSource;
        }
        if (nextProps.imageSource) {
            newState.animating = true;
        }
        else {
            newState.animating = false;
        }
        
        this.setState(newState);
    }
    handleProgress(event){
        const progress = event.nativeEvent.loaded / event.nativeEvent.total;
        let newState = Object.assign({}, this.state);
        newState.progress = progress;
        this.setState(newState);
        if(this.props.loadCallBack){
            this.props.loadCallBack(progress);
        }
    }
    
    handleLonLoadEnd(event){
        
        let newState = Object.assign({}, this.state);
        newState.animating = false;
        newState.progress = 1;
        newState.defaultImageSource = require('../assets/icon.png');
        this.setState(newState);
        if(this.props.loadCallBack){
            this.props.loadCallBack(1);
        }
    }
    handleStart(event){
        let newState = Object.assign({}, this.state);
        newState.animating = true;
        newState.progress = 0;
        this.setState(newState);
        if(this.props.loadCallBack){
            this.props.loadCallBack(0);
        }
    }
    clickHandle() {
        if (this.props.onPress) {
            this.props.onPress(this.props.data)
        }
    }
    
    
    render() {
        
        let props = {};
        props.resizeMethod = this.props.resizeMethod;
        props.resizeMode = this.props.resizeMode;
        
        
        return <TouchableOpacity {...props} activeOpacity={this.props.onPress ? 0.3 : 1}
        onPress={this.clickHandle.bind(this)}>
        
        <Image {...props}
        style={this.props.style}
        source={this.state.defaultImageSource}/>
        
        {this.props.imageSource && <Image {...props}
            style={[{position: 'absolute', top: 0, left: 0,justifyContent:'center'}, this.props.style]}
            source={this.props.imageSource}
            onProgress={this.handleProgress.bind(this)}
            onLoadStart={this.handleStart.bind(this)}
            onLoadEnd={this.handleLonLoadEnd.bind(this)}
            >
            {!this.props.customIndicator && !this.props.hiddenProgress && this.props.indicatorType==='circle' && this.state.animating && <ActivityIndicator size="small"
                progress={this.state.progress} {...this.props.indicatorProps}/>}
            {!this.props.customIndicator && !this.props.hiddenProgress && this.props.indicatorType==='line' && this.state.animating && <ProgressBar color="red" progress={this.state.progress}
                progressProps ={this.props.indicatorProps}/>}
            
            {this.props.customIndicator && !this.props.hiddenProgress && this.state.animating && <this.props.customIndicator progress={this.state.progress} {...this.props.indicatorProps}/>}
            
            </Image>}
        
        <View style={[{position: 'absolute', top: 0, left: 0}, this.props.style]}>
        {this.props.children}
        </View>
        
        </TouchableOpacity>
        
    }
    
    
};

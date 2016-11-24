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

import RNFS, { DocumentDirectoryPath } from 'react-native-fs';
const URL = require('url-parse');
const MD5 = require("crypto-js/md5");


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
        cachedImagePath:null,
        animating: props.source ? true : false,
        defaultSource: props.defaultSource ? props.defaultSource : require('../assets/icon.png'),
        source: props.source ? props.source : require('../assets/icon.png'),
        isLoalImage:PropTypes.bool, //是否是本地图片
        cacheable:false,
        }
    }
    
    
    clearImageCache(url){
        
        const dirPath = this.fileDirectory();
        const filePath = this.fullFilePath(this.fileName(url));
        
        RNFS.exists(filePath).then((haveFile) => {
                                   if (haveFile) {
                                   RNFS.exists(filePath).then((res) => {
                                                              if (res) {
                                                              RNFS.unlink(filePath).catch((err) => {});
                                                              }
                                                              });
                                   }
                                   })
    }
    
    static propTypes = {
        ...Image.propTypes,
        
    defaultSource: PropTypes.oneOfType([PropTypes.shape({
                                                        uri: PropTypes.string,
                                                        }),
                                        PropTypes.number,
                                        PropTypes.arrayOf(
                                                          PropTypes.shape({
                                                                          uri: PropTypes.string,
                                                                          width: PropTypes.number,
                                                                          height: PropTypes.number,
                                                                          }))
                                        ]),
    source: PropTypes.oneOfType([PropTypes.shape({ uri: PropTypes.string, }),
                                 PropTypes.number,
                                 PropTypes.arrayOf( PropTypes.shape({
                                                                    uri: PropTypes.string,
                                                                    width: PropTypes.number,
                                                                    height: PropTypes.number,
                                                                    }))
                                 ]),
    style: PropTypes.oneOfType([PropTypes.object,PropTypes.number]),
    onPress: PropTypes.func,
    customIndicator: PropTypes.func,
    indicatorType:PropTypes.oneOf(['circle','line']),//默认是circle类型
    indicatorProps: PropTypes.object,
    data: PropTypes.any ,//点击事件，数据传输
    loadCallBack:PropTypes.func,
    hiddenProgress:PropTypes.bool,
    clearCaheWillUnmount:PropTypes.bool
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
        if (nextProps.defaultSource) {
            newState.defaultSource = nextProps.defaultSource;
        }
        if (nextProps.source) {
            newState.animating = true;
        }
        else {
            newState.animating = false;
        }
        
        this.setState(newState);
    }
    
    
    fileName(aurl){
        const url = new URL(aurl);
        const type = url.pathname.replace(/.*\.(.*)/, '$1');
        return MD5(url)+'.'+type
    }
    
    fileDirectory(){
        return DocumentDirectoryPath+'/CacheImage'
    }
    fullFilePath(fileName){
        return this.fileDirectory()+'/'+fileName;
    }
    
    getImageContent(source,fileName){
        
        let fullPath = this.fullFilePath(fileName);
        
        console.log('fullPath = ',fullPath)
        RNFS.stat(fullPath).then((result)=>{
                                 
                                 
                                 if(result.isFile()){//存在文件
                                 this.handleLonLoadEnd()
                                 this.setState({cacheable: true, source: fullPath});
                                 }
                                 }).catch(()=> {
                                          
                                          RNFS.mkdir(this.fileDirectory(), {NSURLIsExcludedFromBackupKey: true}).then(() => {
                                                                                                                      let downloadOptions = {
                                                                                                                      fromUrl: source.uri,
                                                                                                                      toFile: fullPath,
                                                                                                                      background: true,
                                                                                                                      begin: this.handleStart.bind(this),
                                                                                                                      progress: this.handleProgress.bind(this)
                                                                                                                      };
                                                                                                                      
                                                                                                                      RNFS.downloadFile(downloadOptions)
                                                                                                                      this.setState({cacheable: true, source: fullPath});
                                                                                                                      
                                                                                                                      }).catch((err) => {
                                                                                                                               this.setState({cacheable: false, source: null});
                                                                                                                               })
                                          })
    }
    
    
    analysisSource(source){
        if (source !== null
            && typeof source === "object"
            && source.hasOwnProperty('uri')) {
            
            const url = new URL(source.uri);
            const type = url.pathname.replace(/.*\.(.*)/, '$1');
            
            let fileName = this.fileName(source.uri);
            this.getImageContent(source,fileName);
            this.setState({isLoalImage: false});
        }
        else {
            this.setState({isLoalImage: true});
        }
    }
    
    componentWillMount() {
        this.analysisSource(this.state.source.uri)
    }
    componentWillUnmount() {
        if(this.props.clearCaheWillUnmount) {
            this.clearImageCache(this.props.source.uri)
        }
    }
    
    
    async handleStart(){
        let newState = Object.assign({}, this.state);
        newState.animating = true;
        newState.progress = 0;
        this.setState(newState);
        if(this.props.loadCallBack){
            this.props.loadCallBack(0);
        }
    }
    
    async handleProgress(event){
        
        let progress =  (event.bytesWritten / event.contentLength )
        
        if(progress<1) {
            let newState = Object.assign({}, this.state);
            newState.progress = progress;
            this.setState(newState);
            if (this.props.loadCallBack) {
                this.props.loadCallBack(progress);
            }
        }
        else{
            let newState = Object.assign({}, this.state);
            newState.progress = 1;
            newState.animating = false;
            this.setState(newState);
            if (this.props.loadCallBack) {
                this.props.loadCallBack(1);
            }
        }
        
    }
    
    handleLonLoadEnd(){
        
        let newState = Object.assign({}, this.state);
        newState.animating = false;
        newState.progress = 1;
        newState.defaultSource = require('../assets/icon.png');
        this.setState(newState);
        if(this.props.loadCallBack){
            this.props.loadCallBack(1);
        }
    }
    
    clickHandle() {
        if (this.props.onPress) {
            this.props.onPress(this.props.data)
        }
    }
    
    marginAndPadding(){
        return {
        marginHorizontal:0,
        marginVertical:0,
        paddingHorizontal:0,
        paddingVertical:0,
        marginLeft:0,
        marginRight:0,
        marginTop:0,
        marginBottom:0,
        paddingLeft:0,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        }
    }
    
    renderCache(props) {
        return (
                <Image {...props}
                style={[{position: 'absolute', top: 0, left: 0,justifyContent:'center'}, this.props.style,this.marginAndPadding()]}
                source={this.props.source}
                
                >
                {!this.props.customIndicator && !this.props.hiddenProgress && this.props.indicatorType==='circle' && this.state.animating && <ActivityIndicator size="small"
                progress={this.state.progress} {...this.props.indicatorProps}/>}
                {!this.props.customIndicator && !this.props.hiddenProgress && this.props.indicatorType==='line' && this.state.animating && <ProgressBar color="red" progress={this.state.progress}
                progressProps ={this.props.indicatorProps}/>}
                
                {this.props.customIndicator && !this.props.hiddenProgress && this.state.animating && <this.props.customIndicator progress={this.state.progress} {...this.props.indicatorProps}/>}
                
                </Image>
                );
    }
    
    renderLocal(props){
        return  <Image {...props}
        style={[{position: 'absolute', top: 0, left: 0,justifyContent:'center'}, this.props.style,this.marginAndPadding()]}
        source={this.props.source}
        >
        </Image>
    }
    
    render() {
        let props = {};
        props.resizeMethod = this.props.resizeMethod;
        props.resizeMode = this.props.resizeMode;
        
        
        return <TouchableOpacity {...props} style={[this.props.style]} activeOpacity={this.props.onPress ? 0.3 : 1}
        onPress={this.clickHandle.bind(this)}>
        
        <Image {...props}
        style={[this.props.style,this.marginAndPadding()]}
        source={this.state.defaultSource}/>
        
        {this.props.source && this.state.isLoalImage && this.renderLocal(props)}
        
        {this.props.source && !this.state.isLoalImage && this.state.cacheable && this.renderCache(props)}
        
        <View style={[{position: 'absolute', top: 0, left: 0}, this.props.style]}>
        {this.props.children}
        </View>
        
        </TouchableOpacity>
        
    }
    
    
};

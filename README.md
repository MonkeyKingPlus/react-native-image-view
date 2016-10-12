# react-native-image-view
##功能介绍 
1.支持图片下载前显示默认图片，下载完成后替换成下载后图片

2.支持图片下载时显示加载动画

3.支持点击，圆角，添加子节点等功能

4.特别处理安卓环境下同时设置了默认图片和下载图片后，点击时会显示默认图片的问题

支持安卓及iOS 7.0及以上。

##如何安装
```bash
npm install https://github.com/MonkeyKingPlus/react-native-image-view.git
```

##如何使用
```javascript
import MKPLoadImageView from "react-native-image-view";

<MKPLoadImageView
            imageSource={{uri:"http://imga1.pic21.com/bizhi/140116/06682/01.jpg"}}
            style={{margin:100,width:100,height:100,borderRadius:50,overflow:"hidden"}}
            clickHandle={()=>{}}>
</MKPLoadImageView>
```

##属性说明
* backImageSource(可选)：背景图，可选，建议使用本地图片 ,
* imageSource(可选)：图片资源，网络图片支持显示进度,
* style(可选)：样式,
* clickHandle(可选)：点击方法，实现后会添加点击效果，没实现则不会有点击效果,
* showLoading(可选)：true，显示下载动画，false不显示下载动画，默认为true,

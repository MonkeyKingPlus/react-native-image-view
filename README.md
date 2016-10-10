# react-native-image-view
##功能介绍 
1.支持图片下载前显示默认图片，下载完成后替换成下载后图片

2.支持图片下载时显示加载动画

3.支持点击，圆角，添加子节点等功能

4.特别处理安卓环境下同时设置了默认图片和下载图片后，点击时会显示默认图片的问题

支持安卓及iOS 7.0及以上。

##如何安装
```javascript
npm install https://github.com/MonkeyKingPlus/react-native-image-view.git
```

##如何使用

#### 导入头文件 import MKPLoadImageView from "react-native-image-view" 


```javascript
	<MKPLoadImageView
                imageSource={{uri:"http://imga1.pic21.com/bizhi/140116/06682/01.jpg"}}
                style={{margin:100,width:100,height:100,borderRadius:50,overflow:"hidden"}}
                clickHandle={()=>{}}>
	</MKPLoadImageView>
```
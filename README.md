# react-native-image-view
##功能介绍 
1.支持图片下载前显示默认图片，下载完成后替换成下载后图片

2.支持图片下载时显示加载动画

3.支持点击，圆角，添加子节点等功能

4.特别处理安卓环境下同时设置了默认图片和下载图片后，点击时会显示默认图片的问题

5.支持图片本地缓存

6.支持自定义加载进度

支持安卓及iOS 7.0及以上。

##如何安装
```bash
npm install https://github.com/MonkeyKingPlus/react-native-image-view.git --save
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

Any [`Image` property](http://facebook.github.io/react-native/docs/image.html) and the following:

| 属性 | 描述 | 默认值 |
|---|---|---|
|**`imageSource`**|(必选） 图片资源,支持本地图片和网络图片|{uri:`imageUrl`}／require(`imagePath`)|
|**`backImageSource`**|(可选）背景图，可选，建议使用本地图片|*None*|
|**`style`**|(可选) 样式|*style={{width:200,height:200}}*|
|**`onPress`**|(可选) 点击事件|*None*|
|**`customIndicator`**|(可选) 自定义图片下载进度指示器|*None*|
|**`indicatorType`**|(可选) 默认图片下载进度指示器样式|*circle*|
|**`data`**|(可选) 用于点击事件数据回传|*None*|
|**`loadCallBack`**|(可选) 下载进度回调函数|*None*|
|**`hiddenProgress`**|(可选) 隐藏下载进度条|*false*|
|**`clearCaheWillUnmount`**|(可选) 设置true时，当Image对象销毁的时候删除掉本地缓存图片|*false*|


## Demo
![image-progress-demo](https://github.com/kunkunbobo/Test/blob/master/Asset/1.mov)








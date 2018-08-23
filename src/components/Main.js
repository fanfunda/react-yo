require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数,讲图片信息转成图片URL路径信息
imageDatas = (function getImageURL(imageDatasArr) {
    // 遍历imageDatasArr数组数据
    for (var i = 0; i < imageDatasArr.length; i++) {
        // 获取数组中单个图片数据的信息
        var singeImageData = imageDatasArr[i];
        // 给单个图片数据添加图片路径信息
        singeImageData.imageURL = require('../images/'
            + singeImageData.fileName);
        // 将单个图片数据重新赋值给imageDatasArr[i]
        imageDatasArr[i] = singeImageData;
    }

    // 返回imageDatasArr
    return imageDatasArr;

})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
        <section className="stage">
          <section className="img-sec">

          </section>
          <nav className="controller-nav">

          </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

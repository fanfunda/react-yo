require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {

    // 遍历imageDatasArr数组数据
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        // 获取数组中单个图片数据的信息
        var singleImageData = imageDatasArr[i];
        // 给单个图片数据添加图片路径信息
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        // 将单个图片数据重新赋值给imageDatasArr[i]
        imageDatasArr[i] = singleImageData;
    }

    // 返回imageDatasArr
    return imageDatasArr;
})(imageDatas);

// img标签在react中应该是<img/>，其中的src和alt不可添加引号，否则会报错
var ImgFigure = React.createClass({
    render: function () {
        return (
            <figure className="img-figure">
            <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
        <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
        </figure>
    );
    }
});

class AppComponent extends React.Component {
    render() {
        var controllerUnits = [],
            imgFigures = [];
        imageDatas.forEach(function (value) {
            imgFigures.push(<ImgFigure data={value}/>);
        });

        return (
            <section className="stage">
            <section className="img-sec">
            {imgFigures}
            </section>
            <nav className="controller-nav">
            {controllerUnits}
            </nav>
            </section>
    );
    }
}
AppComponent.defaultProps = {
};

export default AppComponent;
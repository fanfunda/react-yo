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

/*
 * 获取区间内的一个随机值函数
 */
function getRangeRandom(low,high){
    return Math.ceil(Math.random() * (high - low) + low);
}

// img标签在react中应该是<img/>，其中的src和alt不可添加引号，否则会报错
var ImgFigure = React.createClass({
    render: function () {

        var styleObj = {};

        // 如果prpos属性中指定了这张图片的位置，则
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

        return (
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
});

class AppComponent extends React.Component {
  Constant: {
      centerPos: {     // 中心图片位置
          left: 0,
          right: 0,
      },
      hPosRange: {     // 水平方向取值范围
          leftSecX: [0,0],
          rightSecX: [0,0],
          y: [0,0]
      },
      vPosRange: {     // 垂直方向取值范围
          topY: [0,0],
          x: [0,0]
      }
  };

  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange: function(centerIndex) {
      var imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          vPosRangeY = vPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,

          imgsArrangeTopArr = [],
          topImgNum = Math.ceil(Math.random() * 2),  // 取一个或者不取
          topImgSplicIndex = 0,

          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

          // 首先居中 centerIndex 的图片
          imgsArrangeCenterArr[0].pos = centerPos;

          // 去除要布局上方的图片的状态信息
          topImgSplicIndex = Math.ceil(Math.random() * (imgsArrangeArr.length
              - topImgNum));
          imgsArrangeTopArr = imgsArrangeArr.splice(topImgSplicIndex,topImgNum);

          // 布局位于上方的图片
          imgsArrangeTopArr.forEach(function(){
              imgsArrangeTopArr[index].pos = {
                  top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
              };
          });

          // 布局位于左右两侧的图片
          for(var i =0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
              var hPosRangeLORX = null;

              // 前半部分布局左边，后半部分布局右边
              if(i < k){
                  hPosRangeLORX = hPosRangeLeftSecX;
              }else {
                  hPosRangeLORX = hPosRangeRightSecX;
              }

              imgsArrangeArr[i].pos = {
                  top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
              };
          }

          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
              imgsArrangeArr.splice(topImgSplicIndex,0,imgsArrangeTopArr[0]);
          }

          imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

          this.setState({
              imgsArrangeArr: imgsArrangeArr
          });
  }
  /*
   *
   */
  getInitialState: function(){
      return {
          imgsArrangeArr: [
              /*{
                  pos: {
                      left: '0',
                      top: '0'
                  }
              }*/
          ]
      };
  },

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount: function (){

      // 首先拿到舞台的大小
      var stageDOM = React.findDOMNode(this.refs.stage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2);

      var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

      // 计算中心图片的位置
      this.Constant.centerPos = {
          left: halfStageW  - halfImgW,
          top: halfStageH - halfImgH
      };

      // 计算左侧区域图片的位置的取值范围
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;

      // 计算上方区域图片位置的取值范围
      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
      this.Constant.vPosRange.x[0] = halfStageW -imgW;
      this.Constant.vPosRange.x[1] = halfStageW;

      this.rearrange(0);
  },

  render() {
    var controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach(function (value, index) {
        if(! this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
                pos: {
                    left: 0,
                    top: 0
                }
            };
        }
        imgFigures.push(<ImgFigure data={value} ref={'imgfigure' + index}
        arrange={this.state.imgsArrangeArr[index]}/>);
    }.bind(this);

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

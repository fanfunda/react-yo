require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片的json数据
var imageDates = require('../data/imageDatas.json');
// 利用getImageURL函数，将图片信息转换成图片URL路径信息
imageDates = (function getImageURL(imageDatesArr) {

    // 遍历imageDatasArr数组数据
    for (var i = 0; i < imageDatesArr.length; i++) {
        // 获取数组中单个图片数据的信息
        var singleImageData = imageDatesArr[i];
        // 给单个图片数据添加图片路径信息
        singleImageData.imageURL = require('../images/' +
            singleImageData.fileName);
        // 将单个图片数据重新赋值给imageDatasArr[i]
        imageDatesArr[i] = singleImageData;
    }

    // 返回imageDatasArr
    return imageDatesArr;
})(imageDates);

/*
 * 取范围内的随机整数
 * @param  low,high
 */
function getRangeRandom(low,high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/* 取30内的随机正负角度 */
function get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

//单个图片组件
class ImgFigure extends React.Component{
    // imgFigure 的点击处理函数
    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        var styleObj={};
        //如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的转角度有值并且不为0，添加旋转角度
        if (this.props.arrange.rotate){
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value]= 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': '';

        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                <img  src={this.props.data.imageURL} alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className='img-back' onClick={this.handleClick.bind(this)}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

// 控制组件
class ControllerUnit extends React.Component{
    handleClick(e){
        /*如果点击的是当前正在选中状态的按钮，就反转图片，
        否则将按钮对应的图片居中显示*/
        if (this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }

    render(){
        var controllerUnitClassName = 'nav-item';

        // 如果对应的是居中的图片，显示控制按钮的居中状态
        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' is-center';

            // 如果同时显示的是反转图片，则显示控制按钮的反转状态
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }
        return (
            <span className={controllerUnitClassName}
            onClick={this.handleClick.bind(this)}></span>
        );
    }
}

//主要的舞台组件
class AppComponent extends React.Component {
    /*
    * 重新布局所有图片
    * @param centerIndex 指定居中排布哪个图片
    */
    rearrange(centerIndex){
        var imgsArrangeArr = this.state.imgsArrangeArr, // 获取图片位置信息数组
            Constant = this.Constant,                   // 获取定位位置对象
            centerPos = Constant.centerPos,             // 获取  居中位置信息
            hPosRange = Constant.hPosRange,             // 获取  水平位置信息
            h_leftSecX = hPosRange.leftSecX,              // 获取  左侧x位置信息
            h_rightSecX= hPosRange.rightSecX,             // 获取  右侧x位置信息
            h_y = hPosRange.h_y,                          // 获取  y位置信息
            vPosRange = Constant.vPosRange,             // 获取  顶部位置信息
            v_x = vPosRange.v_x,                          // 获取  顶部x位置信息
            v_y = vPosRange.v_y,                          // 获取  顶部y位置信息

            // 获取顶部图片index并处理
            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),  // 取一个或者不取
            topImgSpliceIndex = 0,

        // 获取居中图片index并居中处理
        imgsArrangeArrCenter = imgsArrangeArr.splice(centerIndex,1);

        // 首先居中 centerIndex 的图片居中的图片不需要旋转
        imgsArrangeArrCenter[0]={
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        // 去除要布局上方的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length
            - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        // 布局位于上方的图片
        imgsArrangeTopArr.forEach(function(value,index){
            imgsArrangeTopArr[index] = {
                pos: {
                    left: getRangeRandom(v_x[0],v_x[1]),
                    top: getRangeRandom(v_y[0],v_y[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        //获取水平方向上的图片信息并处理
        var k = Math.ceil(imgsArrangeArr.length / 2);
        for (var i = 0; i <  imgsArrangeArr.length; i++) {
            // 前半部分布局左边，后半部分布局右边
            if (i < k) {
                imgsArrangeArr[i] = {
                    pos: {
                        left:  getRangeRandom(h_leftSecX[0],h_leftSecX[1]),
                        top: getRangeRandom(h_y [0],h_y [1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                };
            }else{
                imgsArrangeArr[i] = {
                    pos: {
                        left: getRangeRandom(h_rightSecX[0],h_rightSecX[1]),
                        top: getRangeRandom(h_y [0],h_y [1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                };
            }
        }

        // debugger;

        // 将取出的数组元素修改之后放回去
        // 顶部图片
        if (imgsArrangeArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        // 中间图片
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeArrCenter[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })

    }
    // 初始化数据
    constructor(props) {
        // constructor( )——构造方法，super( ) ——继承
        super(props);
        this.state = { imgsArrangeArr: []};

        // 位置范围常量
        this.Constant= {
            centerPos:{         // 中心图片位置
                left:0,
                top: 0
            },
            hPosRange:{         // 水平方向取值范围
                leftSecX:[0,0],
                rightSecX:[0,0],
                h_y:[0,0]
            },
            vPosRange:{         // 垂直方向取值范围
                v_x:[0,0],
                v_y:[0,0]
            }
        };
    }

    // ES6的classes里面getInitialState函数已经抛弃，需要删除，我们设置state需在constructor函数里面
    /*getInitialState(){
        return {
            imgsArrangeArr: []
        };
    }*/

    /*
     * 翻转图片
     * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
     */
    inverse(index){
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;

            // 将正面显示的图片转为反面；反之则转为正面
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            // 重新渲染数据
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }

    /*
     * 利用 rearrange 函数，居中对应 index 图片
     * @param index，需要被居中的图片对应的图片信息
     * @return { Function }
     */

    center(index){
        return function () {
            this.rearrange(index);
        }.bind(this);
    }

    // 组件加载后运行函数，为每张图片计算其位置的范围
    componentDidMount(){
        // 舞台的宽高以及半宽半高
        // var stageDOM = React.findDOMNode(this.refs.stage),
        // 上面的写法已被废除，在新的react中会报错，建议用下面的写法
        var stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);

        // 图片的宽高以及半宽半高
        // imgDOM = this.refs.imgFigure0,
        var imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgDOM.scrollWidth,
            imgH = imgDOM.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);

        // 中央图片的位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };
        // 水平方向上左右两侧图片的取值范围start
        // 左
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        // 右
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        //垂直
        this.Constant.hPosRange.h_y[0] = -halfImgH;
        this.Constant.hPosRange.h_y[1] = stageH - halfImgH;
        // 水平方向上左右两侧图片的取值范围end

        // 垂直方向上顶部图片的取值范围start
        this.Constant.vPosRange.v_x[0] = halfStageW - imgW;
        this.Constant.vPosRange.v_x[1] = halfStageW;
        this.Constant.vPosRange.v_y[0] = -halfImgH;
        this.Constant.vPosRange.v_y[1] = halfStageH - halfStageH * 3;
        // 垂直方向上顶部图片的取值范围end

        // 默认居中第一张图片
        this.rearrange(0);
    }

    render() {
        var controllerUnits=[],
            // that = this,
            imgFigures=[];
        // 也可使用map方法遍历
        imageDates.forEach(function(value,index){
            // 如果图片的位置信息不存在的话，初始化所有图片位置
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure key={index} data={value}
                arrange={this.state.imgsArrangeArr[index]}
                ref={'imgFigure'+index} inverse={this.inverse(index)}
                center={this.center(index)}/>);

            controllerUnits.push(<ControllerUnit key={index}
                arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)}
                center={this.center(index)}/>);
        }.bind(this));
        return (
            <section className="stage" ref="stage">
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
(function(prototype){
	function queryURLParameter(){
		var reg=/([^?=&#]+)=([^?=&#]+)/g,
		obj={};
		this.replace(reg,function(){
			obj[arguments[1]]=arguments[2];
		});
		return obj;
	}
	prototype.queryURLParameter=queryURLParameter;
})(String.prototype)

var loadingRender=(function(){
	var imgArr=["001.jpg","002.jpg","003.jpg","004.jpg","005.jpg","006.jpg","007.jpg","008.jpg",
	"009.jpg","010.jpg","011.jpg","012.jpg","013.jpg","014.jpg","015.jpg","016.jpg","017.jpg",
	"018.jpg","019.jpg","020.jpg","021.jpg","022.jpg","023.jpg","024.jpg","025.jpg","026.jpg",
	"027.jpg","028.jpg","029.jpg","030.jpg","call.png","call1.png","call2.png","go-back.jpg",
	"go-back.png","iphone-call.jpg","iphonecall3.jpg","iphonecall3.png","keyboard.png",
	"phonecall.jpg","phonecall.png","phonecall1.png","phonecall2.png","receive.png",
	"receive1.png","touxiang.jpg"]
	var $Loading=$("#loading"),
		$em=$Loading.find(".em"),
		step=0,
		total=imgArr.length;
	return {
		init:function(){
			$Loading.css('display','block')
			$.each(imgArr,function(index,item){
				var oImage=new Image();
				oImage.src='./Image/'+item;
				oImage.onload=function(){
					step++;
					$em.css('width',(step/total)*100+'%');
					oImage=null;				
					if (step===total) {
						window.setTimeout(function(){
							$Loading.css('display','none');
							phoneRender.init();
						},3000);
					}
				}
			})

		}
	}
})();
var messageRender=(function(){
	var $MESSAGE=$('#message'),
	$messageList=$MESSAGE.children('.messageList'),
	$list=$messageList.children('li'),
	$keyBoard=$MESSAGE.children('.keyBoard'),
	$textTip=$keyBoard.children('.textTip'),
	$submit=$keyBoard.children('.submit');
	var autoTimer=null,
		step=-1,
		total=$list.length,
		bouceTop=10;
	function messageMove(){
		autoTimer=window.setInterval(function(){
			step++;
			var $curLi=$list.eq(step);
			$curLi.css({opacity:'1',transform:'translateY(0)'});
			if(step===2){
				window.clearInterval(autoTimer);
				$keyBoard.css('transform','translateY(0)');
				$textTip.css('display','block');
				textMove('真想警告！');
			}
			if(step>=3){
				bouceTop-=$curLi[0].offsetHeight;
				$messageList.css('transform','translateY('+bouceTop+'px)');
			}
			if(step==total-1){
				window.clearInterval(autoTimer);

				window.setTimeout(function(){				
					$MESSAGE.css('display','none');
					cubeRender.init();
				},1500)
			}
		},1500)
	}
	function textMove(str){
		var index=-1,
			result='';
		var textTimer=window.setInterval(function(){
			index++;
			result+=str[index];
			$textTip.html(result);
			if(index===str.length-1){
				window.clearInterval(textTimer);
				$submit.css('display','block').tap(function(){
					$textTip.css('display','none');
					$submit.css('display','none');
					$keyBoard.css('transform','translateY(4.4rem)');
					messageMove();
				});
			}
		},100)
	}
	return{
		init:function(){
			$MESSAGE.css('display','block');
			messageMove();
		}
	}
})()
var phoneRender=(function(){
	var $PHONE=$('#phone'),
		$Listen=$PHONE.children('.listen'),
		$ListenTouch=$Listen.children('.touch'),
		$Details=$PHONE.children('.details'),
		$DetailsTouch=$Details.children('.touch'),
		$Time=$PHONE.children('.time');
	var $ListenMusic=$("#listenMusic")[0],
		$DetailsMusic=$("#detailsMusic")[0],
		musicTimer=null;
	function detailsMusicFn(){
		$DetailsMusic.play();
		musicTimer=window.setInterval(function(){
			var curTime=$DetailsMusic.currentTime,
				curMin=Math.floor(curTime/60),
				curSec=Math.floor(curTime%60);
			curMin=curMin<10?'0'+curMin:curMin;
			curSec=curSec<10?'0'+curSec:curSec;
			$Time.html(curMin+':'+curSec);
			if(curTime===$DetailsMusic.duration){
				closePhone();
			}
		},1000);
		
	}
	function closePhone(){
		$PHONE.css('transform',
		'translateY('+document.documentElement.
		clientHeight+'px)').on('webkitTransitionEnd',function(){
			$PHONE.css('display','none');
		});
		window.clearInterval(musicTimer);
		$DetailsMusic.pause();
		messageRender.init();
	}
	return{
		init:function(){
			$PHONE.css('display','block');
			$ListenMusic.play();
			//为Listen中的Touch绑定单击事件
			$ListenTouch.tap(function(){
				$Listen.css('display','none');
				$ListenMusic.pause();

				$Details.css('transform','translateY(0)');
				$Time.css('display','block');
				detailsMusicFn();
				
			});
			$DetailsTouch.tap(function(){
				closePhone();
			}) 
		}
	}
})()
var cubeRender=(function(){
	$CUBE=$('#cube');
	$cubeBox=$CUBE.children('.cubeBox');
	$cubeLis=$cubeBox.children('li');
	function start(ev){
		var point=ev.touches[0];
		$(this).attr({
			strX:point.clientX,
			strY:point.clientY,
			changeX:0,
			changeY:0
		})
	}
	function move(ev){
		var point=ev.touches[0],
			changeX=point.clientX-$(this).attr('strX'),
			changeY=point.clientY-$(this).attr('strY');
		$(this).attr({
			changeX:changeX,
			changeY:changeY
		})
	}
	function end(ev){
		var changeX=parseFloat($(this).attr('changeX')),
			changeY=parseFloat($(this).attr('changeY'));
		var rotateX=parseFloat($(this).attr('rotateX'))-changeY/3,
			rotateY=parseFloat($(this).attr('rotateY'))+changeX/3;
		if(!isSwipe(changeX,changeY)) return;
		$(this).attr({
			rotateX:rotateX,
			rotateY:rotateY
		}).css('transform','rotateX('+rotateX+'deg) rotateY('+rotateY+'deg) scale(0.6)');
	}
	function isSwipe(changeX,changeY){
		return Math.abs(changeX)>30||Math.abs(changeY)>30;
	}
	return {
		init:function(){
			$CUBE.css('display','block');
			$cubeBox.attr({
			rotateX:-25,
			rotateY:25,
			changeX:0,
			changeY:0
			}).on('touchstart',start).on('touchmove',move).on('touchend',end);
			$cubeLis.tap(function(){
				$CUBE.css('display','none');
				var index=$(this).index();
				swiperRender.init(index);
			})
		}
	}
})()
var swiperRender=(function(){
	$SWIPER=$('#swiper');
	$return=$SWIPER.children('.return');
	$return.tap(function(){
		$SWIPER.css('display','none');
		$CUBE.css('display','block')
	})
	return{
		init:function(index){
			$SWIPER.css('display','block');
			
			function change(){
				console.log('sliderOver')
				console.log(index);
				var sliderAry=this.slides,
					sliderIndex=this.activeIndex;
					console.log(sliderIndex);
					$.each(sliderAry,function(ind,item){
						
						if(ind===sliderIndex){

								item.id='page'+(sliderIndex+1);
								return;
						}
						item.id=null;
					})
			}
			var mySwiper=new Swiper('.swiper-container',
			{	effect:'coverflow',
				on:{
					transitionEnd:change,
					init:change
				}
			});
			var index=index||0;
			mySwiper.slideTo(index);
		}
	}
})()
loadingRender.init();
var urlObj=window.location.href.queryURLParameter(),
	page=parseFloat(urlObj['page']);
// if(page===0||isNaN(page)){
// 	loadingRender.init();
// }
// if(page===1){
// 	phoneRender.init();
// }
// if(page===2){
// 	messageRender.init();
// }
// if(page==3){
// 	cubeRender.init();
// }
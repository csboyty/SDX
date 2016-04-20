/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var directives=angular.module("directives",["services","models"]);
directives.directive("controlScroll", ["$timeout","$window","$document","Clothes","Config","Storage",
    function ($timeout,$window,$document,Clothes,Config,Storage) {
        return {
            link: function(scope, element, attrs) {
                var elem=element[0],
                    clientH=0,
                    oldScrollTop= 0;

                var mousewheelEvt= $document[0].onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
                var mousewheelHandler=function (evt) {
                    evt = window.event || evt;

                    //兼容ie
                    if(evt.preventDefault){
                        evt.preventDefault();
                    }else{
                        evt.returnValue=false;
                    }

                    clientH=elem.clientHeight;
                    if(evt.wheelDelta <0 || evt.detail>0){
                        //下滚
                        if(oldScrollTop+clientH<=elem.scrollHeight+1){
                            elem.scrollTop=oldScrollTop+(clientH%2==0?clientH:clientH-1);
                            oldScrollTop=elem.scrollTop;
                            if(Storage.lastLoadedCount!=Config.hasNoMoreFlag){
                                Clothes.query(function(data){
                                    scope.items=scope.items.concat(data.items);
                                    if(data.hasNoMore){
                                        Storage.lastLoadedCount=Config.hasNoMoreFlag;
                                    }
                                });
                            }
                        }
                    }else{
                        if(oldScrollTop-clientH>=-1){
                            elem.scrollTop=oldScrollTop-(clientH%2==0?clientH:clientH-1);
                            oldScrollTop=elem.scrollTop;
                        }
                    }
                };

                $window.addEventListener(mousewheelEvt, mousewheelHandler);
            }
        }
    }]);
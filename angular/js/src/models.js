var models=angular.module("models",["ngResource","services"]);
models.factory("Clothes",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.clothesLoad,{},{
            query:{method:"get",params:{pageNum:Config.perLoadCount.list,userId:0}}
        })
    }]);
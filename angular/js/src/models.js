var models=angular.module("models",["ngResource","services"]);
models.factory("Account",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.accountIsExist,{},{
                isExist:{method:"get",params:{limit:Config.perLoadCount.list,offset:0,choice:0}},
                submitSelect:{method:"get",url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.submitSelect,
                    params:{limit:10,offset:0,choice:1}}
            })
    }]);
models.factory("Clothes",["$rootScope","$resource","Config",
    function($rootScope,$resource,Config){
        return $resource(Config.ajaxUrls.baseUrl+Config.ajaxUrls.clothesLoad,{},{
            query:{method:"get",params:{limit:Config.perLoadCount.list,offset:0}}
        })
    }]);
<?php

    $obj=array("resultCode"=>200,"hasNoMoreFlag"=>200);
    $results=array();
    $i=0;
    while($i<10){
        array_push($results,array("id"=>mt_rand(),"imageUrl"=>"data/".mt_rand(1,8).".jpg"));
        $i++;
    };
    $obj["object"]=$results;
    die(json_encode($obj));
?>
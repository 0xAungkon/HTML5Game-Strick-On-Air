var play_button=document.querySelector(".cover_sub_cn .play");
var gameover=document.querySelector(".cover_sub_cn .gameover");
var score=document.querySelector(".cover_sub_cn .score");
var play_again=document.querySelector(".cover_sub_cn .play_again");
var cover_cn=document.querySelector(".cover_cn");
var bg=document.querySelector(".cover_overlay");
var main=document.querySelector("main");
var cover_page=document.querySelector(".cover");
var bullets=document.querySelector(".bullets");
var bullet_cn=document.querySelector(".bullet_cn");
// veriable can be called from anywhere in js
var environment="production";

function c(data){
    if(environment=="development"){
        console.log(data)
    }
}
// in development or not
// pos= position

window.onload= function(){
    localStorage.setItem("new",true);
    var loading_start=window.setInterval(loading_progress,40);
    var loading_percent=0;
    var proggress_bar=document.querySelector(".proggress_bar");
    // veriable only need on after load
    function loading_progress(){
        if(loading_percent < 100){
            proggress_bar.innerHTML=loading_percent+"%";
            // loading progress
        }
        else{
            clearInterval(loading_start);
            window.setTimeout(function(){
                proggress_bar.addEventListener("transitionend",function(){
                    window.setTimeout(
                        function(){
                            play_button.style.transform="rotate(20deg) scale(1)";
                        },100);
                });
                // set transition event for effect
                proggress_bar.style.transform="rotate(20deg) scale(0)";
                // hiding the loading bar and make visible play button
            },1000);
            // stoping the load
        }
        // limit loading to 99%
        loading_percent++;
    }
    // loading bar of game cover

}



function cover(){
    play_button.style.display="flex";
    play_again.style.display="none";
    gameover.style.display="none";
    score.style.display="none";
}
// active cover page
function backcover(){
    play_button.style.display="none";
    play_again.style.display="flex";
    gameover.style.display="block";
    score.style.display="block";
}
// active backcover page

function game_start(){
    var score=document.querySelector(".score span");
    var score_html=document.querySelector(".score_html span");
    var score_count=score_html.getAttribute("data-score") - 0;
    score_html.setAttribute("data-score",0);
    score.innerHTML=0;
    score_html.innerHTML=0;
    // restore the score
    if(localStorage.getItem("new")=="true"){
        cover_cn.addEventListener("transitionend", function(){
            bg.addEventListener("transitionend",function(){
                cover_page.style.display="none";
                main.style.display="flex";
                cover_cn.removeAttribute("style");
                bg.removeAttribute("style");
                // clearing style
                localStorage.setItem("new",false);
            });
            bg.style.opacity=0;
        });
        cover_cn.style.transform="scale(0)";
        // effects for first time
    }
    else{
       
        cover_cn.style.display="none";
        main.style.display="flex";
        // effects for another time
    }
    // if = first load this page , else = another time
}

function game_end(){
    main.style.display="none";
    cover_page.style.display="flex";
    backcover();
    // game end page

    var blocks=document.querySelectorAll(".blocks img");
    for(var i=0;i<blocks.length;i++){
        blocks[i].style.display="block";
    }
    // restore the blocks

    var bullets=document.querySelector(".bullets");
    bullets.innerHTML="";
    bullets.setAttribute("data-bullets",5);
    for(var b=0;b<5;b++){
        var bullet=document.createElement("img");
        bullet.setAttribute("src","images/bullet_show.svg");
        bullets.appendChild(bullet);
    }
    // restore the bullets

    
}
game_activity_start();
// warming up game setup 

function game_activity_start(){
    var game_tm=window.setInterval(game_update,30);
    function game_update(){
        var blocks=document.querySelectorAll(".blocks img");
        for(var i=0;i<blocks.length;i++){
            block_move(blocks[i]);
            
        }
        // block move
        var bullets_list=document.querySelectorAll(".bullet_cn img");
        for(var i=0;i<bullets_list.length;i++){
            var pos=bullets_list[i].getAttribute("data-pos")-0;
            if(pos > 100){
                bullets_list[i].remove();
                if(document.querySelectorAll(".bullets img").length == 0 ){
                    
                    window.setTimeout(function(){game_end();},1000);
                 }
                 // game is over
            }
            // destroy the bullet after go top
            else{
                bullets_list[i].setAttribute("data-pos",pos+1.5);
                bullets_list[i].style.top="calc("+(100 - pos)+"% - 100px)";
                for(var a=0;a<blocks.length;a++){
                    var temp_node=blocks[a];
                    var bottom_pos=window.getComputedStyle(temp_node, null).getPropertyValue("top").replace("px","") - 0;
                    var bullet_position=window.getComputedStyle(bullets_list[i], null).getPropertyValue("top").replace("px","") - 0 ;
                    if(bullet_position > bottom_pos && bullet_position < bottom_pos+50){
                        var left_pos=(window.getComputedStyle(temp_node, null).getPropertyValue("left").replace("px","") - 0 ) - 75;
                        var right_pos=(window.getComputedStyle(temp_node, null).getPropertyValue("left").replace("px","") - 0 ) ;
                        var bullet_left_pos=window.getComputedStyle(bullets_list[i], null).getPropertyValue("left").replace("px","") - 0 ;
                        if(bullet_left_pos > left_pos && bullet_left_pos < right_pos ){
                            if(environment=="development"){
                                console.log(left_pos+"-->"+right_pos+"="+bullet_left_pos);
                                var test=document.querySelector(".test");
                                var bullet_test=document.querySelector(".bullet_test");
                                test.style.left=left_pos+"px";
                                test.style.top=bottom_pos+"px";
                                test.style.display="block";
                                bullet_test.style.left=bullet_left_pos+"px";
                                bullet_test.style.top=bullet_position+"px";
                                bullet_test.style.display="block";
                            }
                            else{
                                 bullets_list[i].remove();
                                 temp_node.style.display="none";
                                 var score=document.querySelector(".score span");
                                 var score_html=document.querySelector(".score_html span");
                                 var score_count=score_html.getAttribute("data-score") -0;
                                 score_html.setAttribute("data-score",score_count+1);
                                 score.innerHTML=score_count+1;
                                 score_html.innerHTML=score_count+1;

                            }
                            // environment setup
                            
                        }
                        // horizonal target matching
                        
                    }
                    // verticle target matcing
                }
                //   checking all blocks
            }
            // bullet is on it's way
        }
        // bullet move
    }
    // update all move of blockes after 30 milisecond 
}
// gamee activity
function block_move(node){
    var speed=(node.getAttribute("data-speed")-0)/100;
    var dir=node.getAttribute("data-dir") - 0;
    var pos=node.getAttribute("data-pos") -0;
    var rotate=node.getAttribute("data-rotate");
    // block attribute
    if(dir==1){
        if(pos > 99){
            node.setAttribute("data-dir",0);
            node.setAttribute("data-pos",100);
            if(rotate=="true"){
                node.style.transform="rotateY(180deg)";
                // rotate block
            }
            // invert direction of  blocks
        }
        else{
            node.setAttribute("data-pos",pos+speed);
            node.style.left=pos+speed+"%";
            // increment left to right block position
        }
    }
    // direction left to right
    else{
        if(pos < 0){
            node.setAttribute("data-dir",1);
            node.setAttribute("data-pos",0);
            if(rotate=="true"){
                node.style.transform="rotateY(0deg)";
                // rotate block
            }
            // invert direction of  blocks
        }
        else{
            node.setAttribute("data-pos",pos-speed);
            node.style.left=pos-speed+"%";
            // increment  right to left   block position
        }
    }
    // direction right to lefttt

}

function controller_left(){
    var fighter=document.querySelector(".fighter");
    var pos=fighter.getAttribute("data-pos") -0 ;
    var fighter_img=document.querySelector(".fighter img");
    if(pos > 8){
        fighter_img.setAttribute("style","margin-left:calc("+(pos-0.5)+"% - 40px);");
        fighter.setAttribute("data-pos",pos-0.5)
    }
    // controller right to left go
}

function controller_right(){
    var fighter=document.querySelector(".fighter");
    var pos=fighter.getAttribute("data-pos") -0 ;
    var fighter_img=document.querySelector(".fighter img");
    if(pos < 92){
        fighter_img.setAttribute("style","margin-left:calc("+(pos+0.5)+"% - 40px);");
        fighter.setAttribute("data-pos",pos+0.5);
        c("fighter position="+pos);
        // limiting controller move 
    }
    // controller left to right go   
}

function controller_fire(){
    var bullet_count=bullets.getAttribute("data-bullets") - 0;
    if(environment=="development"){
        bullet_count=999999999999999999999;
    }
    if(bullet_count > 0){
        bullets.setAttribute("data-bullets",bullet_count-1);
        var bullets_list=document.querySelectorAll(".bullets img");
        var bullet=document.createElement("img");
        var fighter=document.querySelector(".fighter");
        var fighter_pos=fighter.getAttribute("data-pos") - 0;
        bullet.setAttribute("class","fire_bullet");
        bullet.setAttribute("src","images/bullet.png");
        bullet.setAttribute("style","left:calc("+fighter_pos+"% - 8px);");
        // creating bullets
        bullet.setAttribute("data-pos","0");
        bullet.setAttribute("data-hpos",fighter_pos);
        // warming bullet
        bullet_cn.appendChild(bullet);
        // reloading trigger
        bullets_list[bullets_list.length - 1].remove();
        // cutting off bullet
    }
    // bullet should be remain to 1 atleast
}
// fire event 

window.addEventListener("keydown", function (event) {
    if(event.key=="ArrowLeft"){
        controller_left();
    }
    else if(event.key=="ArrowRight"){
        controller_right();
    }
    else if(event.key==" " || event.key=="Clear"){
        controller_fire();
    }
  });
// creating 
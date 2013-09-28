/**
 * Created by JetBrains WebStorm.
 * User: alfonso
 * Date: 17/06/13
 * Time: 19:03
 * To change this template use File | Settings | File Templates.
 */
var map;
var comentario="B)";
var feliz=true;
var posicion;
var infoW;
var fecha;


function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map-canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    }

}

function atras(){
    $("#containerHappy").css("display","block");
    $("#containerUngry").css("display","block");
    $("#map-canvas").css("display","none");
    map=null;
    $("#razones").val("why?");
    $("#backButton").css("display","none");
    $("#titular").css("display","block");
}

function soyFeliz(e){
    console.log(e);
    feliz=true;
    elijoIco();
}
function soyIneliz(e){
    console.log(e);
    feliz=false;
    elijoIco();
}
function elijoIco(){
    $("#containerHappy").css("display","none");
    $("#containerUngry").css("display","none");
   
    $("#por-que").css("display","block");
    $("#titular").css("display","none");
}

function initialize(){
        console.log("init");
       
        detectBrowser();
       
        $("#containerHappy").click(soyFeliz);
        $("#containerUngry").click(soyInfeliz);
    
        $("#map-canvas").css("height","90%");
    
  
}


function ponSmiley(c,p,h,fechada){

    var infoWindowOptions = {  content: c + "<br>" + String(fechada).substring(0,String(fechada).indexOf("GMT"))  };

    var  infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    if(h){
        var imagen = 'imgs/smiley.png';
    }else {
        var imagen = 'imgs/sadey.png';
    }

    var markerOptions = {
        position: new google.maps.LatLng(p.jb,p.kb),
        icon:imagen,
        map: map
    }

    var m = new google.maps.Marker(markerOptions);
    m.setMap(map);

    google.maps.event.addListener(m,'click',function(e){
       if(infoW){ infoW.close();}
        infoWindow.open(map, m);
        infoW=infoWindow;
    });
}

function ponWifi(x,y){

    var imagen = 'imgs/WIFI.png';
    var markerOptions = {
        position: new google.maps.LatLng(x,y),
        icon:imagen,
        map: map
    }

    var ma = new google.maps.Marker(markerOptions);
    ma.setMap(map);


 
}



function parseado(){

    var todos = Parse.Object.extend("TestObject");
    var query = new Parse.Query(todos);
 //   query.lim
    query.descending('createdAt');

    query.find({
        success: function(results) {

           for(var i=0;i<results.length;i++){
               var object = results[i];
           
                ponSmiley(object.get("coment"), object.get("posicion"), object.get("feliz"), object.get("fecha"));

           }
        },
        error: function(error) {
            console.log("error: "+error);
        }
    });
    
    getWifiPoints();
}

function initParse(){
        Parse.initialize("SpjyTJKJcryw6lyZJ96RhEjfKnrqrQyDhIGiabYD", "SYYpzfkxHJkx3rCO5Fb35GGfAFgVx1MyhBIxwzwJ");

        var TestObject = Parse.Object.extend("TestObject");
        var testObject = new TestObject();
       
        testObject.save(
            {prueba: navigator.userAgent, coment:comentario, posicion:posicion, feliz:feliz, fecha:fecha },
            {success: parseado(), error: function(model, error) {console.log("conexion fallida");alert("fallida.")} });
}


function handleNoGeolocation(errorFlag) {
        console.log("fail");
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(41.38, 2.17),
            content: content
        };

       // var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
}


//41.38,2.17 ----- bcn

google.maps.event.addDomListener(window, 'load', initialize);

//////////////////////////////   HTML functions   /////

function limpia(){
    $("#razones").val("");
    $("#goButton").css("display","inline")
}


function mapea() {///////////////////////////////////////////////////////////////////////// mapea   
      //detectBrowser();
    comentario= $("#razones").val();
    console.log("comment: "+comentario);
    $("#por-que").css("display","none");
    $("#goButton").css("display","none");
    $("#backButton").css("display","block");
    $("#map-canvas").css("display","block");

    var mapOptions = {zoom: 13, mapTypeId: google.maps.MapTypeId.ROADMAP};

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    if(navigator.geolocation) {

        console.log("Browser Si");
            fecha=new Date();

        navigator.geolocation.getCurrentPosition(function(position) {
           
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
            var infoWindowOptions = {
                content: comentario +"<br>"+ String(fecha).substring(0,String(fecha).indexOf("GMT"))//String(new Date()).substring(0,);
            };
            var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

            map.setCenter(pos);
            
            if(feliz){
                var imagen = 'imgs/smiley.png';
            }else {
                var imagen = 'imgs/sadey.png';
            }
            var markerOptions = {
                position: pos,
                icon:imagen,
                animation:google.maps.Animation.BOUNCE,
                map: map
            };

            var marker = new google.maps.Marker(markerOptions);
            marker.setMap(map);
           
            var aGray=[{stylers:[{saturation:100}]}];
            var grayStyle=new google.maps.StyledMapType(aGray,{name:"Gray"});
            map.mapTypes.set("gray",grayStyle);
            map.setMapTypeId("gray"); 

            google.maps.event.addListener(marker,'click',function(e){
               if(infoW){ infoW.close();}
                infoWindow.open(map, marker);
                infoW=infoWindow;
            });
            posicion=pos;
           // initParse();
            google.maps.event.addListenerOnce(map, 'idle',initParse );

        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        console.log("Browser doesn't support Geolocation");
        handleNoGeolocation(false);
    };
}

function getWifiPoints(){
  
  
    $.ajax({
    type: "GET",
    url: "wifis.xml",
    dataType: "xml",
    success: parseXML
  });
   // $.get('http://opendata.bcn.cat/opendata/download.aspx?id=6135', {}, function(xml){
       
}

function parseXML(equisemele){

     
       $(equisemele).find("Punt").each(function(){
                                    
           coords = $(this).find('Coord');
          
          
           var ix= $(coords).find('X').text();
           var iy = $(coords).find('Y').text();
           
                     
          // var co=new UTMConv.UTMCoords("31T", parseFloat(ix), parseFloat(iy));
       
            console.log("coordena as "+co.to_deg());
           
         // ponWifi(co.to_deg().lngd,co.to_deg().latd);
        });
    
}


/*
function getWifiPoints(){
     alert("busco wifi")
    $get.('wifis.xml', {}, function(xml){
        $('Punt', xml).each(function(i){
           coords = $(this).find('Coords');
           alert(coords)
           y = $(coords).find('Coords').find('Y').text();
           
           consoleLog(coords+' '+y);
           alert('coords '+coords+' YYYYYYY: '+y);
        });
    });
}
function entra(e){
    var keycode = null;
   
    if (e.keyCode) {keycode = e.keyCode}
    else if (e.which) {keycode = e.which}
    else if (!e) {var e = window.event}
    if(keycode==13){// si pulsas enter
        var value = $("#razones").val();
        var newValue = value + " \n";
        $("#razones").val(newValue);
    }
    
    
}*/
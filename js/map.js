
$(document).ready(function(){
    var windowWidth  = $(window).width()   

    $(".searchCount").text('');$(".searchCount").hide();$(".searchCount").removeClass('red');$(".jspPane").text('');$(".mobileTab").hide();
    

    $('#searchBox').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $('#searchBtn').trigger('click');
        }
    });

    // back button click
    $("#searchOverlay .leftSection a.back").click(function(){
        $("#searchOverlay").removeClass("open");
        $("body").removeClass("overflow");
        clearMarkers()
    });

    var settings = {
        showArrows: false,
        contentWidth: '0px',
        maintainPosition: false
    };
    var api = $('.listViewTab').jScrollPane(settings).data('jsp');
    api.reinitialise();

    $('#searchBtn').on('click',function(e) {
        $(".searchCount").text('');$(".searchCount").hide();$(".searchCount").removeClass('red');$(".jspPane").text('');$(".mobileTab").hide();
        var searchText = $("#searchBox").val();
        var data = {};
        data.search = searchText;
        gtag('event',searchText , { 'event_category':'Location','event_label':'Search Symbol' })
        clearMarkers()
        $.ajax({
            async: true,
            cache: false,
            type: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: './search',
            dataType: 'json',
            success: function(result) {
                //console.log(result);
                if(result.length <= 0) {                    
                    $(".searchCount").text('No result found. Please try a new search or locate yourself to find nearest stores.')
                    $(".searchCount").addClass('red')
                    $(".searchCount").show()
                    $(".mapViewTab").removeClass("active");
                }else{
                    
                    initMap(result[0].salonLat,result[0].salonLong,result)
                    getDataList(searchText, result)
                    
                    setTimeout(() => {
                        api.reinitialise();
                    }, 1000);
                
                    if (windowWidth <= 1100) {
                        $(".mobileTab").show();
                    }
                    
                }                
            },
            error: function(result) {
                $(".searchCount").text('No result found.')
                $(".searchCount").addClass('red')
                $(".searchCount").show()
            }
        });
    })
    
    $(".giveAccess").on("click",function(e){
       
        $(".searchCount").text('');$(".searchCount").hide();$(".searchCount").removeClass('red');$(".jspPane").text('');$(".mobileTab").hide();
        $(this).attr("onclick", "gtag('event','Search' , { 'event_category':'Location','event_label':'Auto Locate' })")
        var lat;
        var lng;
        $("#searchBox").val('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                getUserGeoLocation(lat,lng)
            });
        } else {
            lat= 23.7043515;
            lng= 72.5242934;
            getUserGeoLocation(lat,lng)
            $("#searchBox").focus();            
        }
        
        function getUserGeoLocation(lat,lng){
            var data = {};
            data.lat = lat;
            data.lng = lng;
            clearMarkers()
            $.ajax({
                async: true,
                cache: false,
                type: "POST",
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: './searchByGeolocation',
                dataType: 'json',
                success: function(result) {
                    //console.log(result);
                    if(result.length <= 0) {
                        $(".searchCount").text('No result found. Please try a new search or locate yourself to find nearest stores.')
                        $(".searchCount").addClass('red')
                        $(".searchCount").show();
                        $(".mapViewTab").removeClass("active");
                    }else{
                        initMap(lat,lng,result)
                        getDataList('currBtn', result)
                        setTimeout(() => {
                            api.reinitialise();
                        }, 1000);
                        if (windowWidth <= 1100) {
                            $(".mobileTab").show();
                        }
                    }
                },
                error: function(result) {
                    $(".searchCount").text('No result found.')
                    $(".searchCount").addClass('red')
                    $(".searchCount").show()
                }
            });
        }
        
    });
    $(document).on('click', '.call', function(e) {
        var phoneNumer = $(this).attr('data-rel');
        var currAddr = $(this).attr('data-content');
        
        $("#call li a").text(phoneNumer)
        $("#call li a").attr("href", "tel:" + phoneNumer)
        $("#call li a").attr("onclick", "gtag('event','"+currAddr+"' , { 'event_category':'Location','event_label':'Contact Number' })")
        $("#call").show()
    });
    $(document).on('click', '.sms', function(e) {
        var phoneNumer = $(this).attr('data-rel');
        var currAddr = $(this).attr('data-content');
        
        $("#sms_details").val(currAddr+'. Call:'+phoneNumer)
        $("#sms_mobile").val('');
        $(".thankYou").hide();
        //$("#sms button .send").attr("onclick", "gtag('event','"+currAddr+"' , { 'event_category':'SMS','event_label':'SMS sent' })")
        $("#sms").show()
    });

    $("#call,#sms a.close").on('click', function(e) {
        $("#call,#sms").hide()
    })   
   
    // open search popup
    $(".dummyClicked").click(function(){
        var getVideoURL = $(".videoBox .video").attr("src")
        $(".videoBox .video").attr("src", "")
        setTimeout(() => {
            $(".videoBox .video").attr("src", getVideoURL)
        }, 1000);
        //console.log(getVideoURL)
        
        $("#searchOverlay").addClass("open");
        $('.giveAccess').trigger('click');
        $("body").addClass("overflow");
        $("html").animate({scrollTop: 0}, 0);
        setTimeout(() => {
            api.reinitialise();
        }, 1000);
    });


    $(window).resize(function(){
        setTimeout(() => {
            api.reinitialise();
        }, 1000);
    })
    
});


function getDataList(searchType, data){
    var currLoc = "",allLocationData = "",UlData = "",liData = "";
    var currCnt = Object.keys(data).length
    var cnt = 0
    if(searchType == 'currBtn'){
        currLoc = "RESULT FOR your current location"
    }else{
        currLoc = "SEARCH RESULT FOR \""+searchType+"\""
    }
    currLoc += " ("+currCnt+")"
    
    UlData = "<ul>"
    $.each(data, function(key, locations) {      
        var lat = locations.salonLat;
        var lng = locations.salonLong;
        var salonMobile = (locations.salonPhone).replace(/\s/g, "");
        //var completeAddr = locations.salonName +","+locations.salonAddress +","+locations.salonCity;
        var completeAddr = locations.salonName +","+locations.salonAddress +","+locations.salonCity +","+locations.salonState +","+locations.salonPincode;
        var smsAddr = locations.salonName +","+locations.salonAddress +","+locations.salonCity +","+locations.salonState +","+locations.salonPincode;
        smsAddr      = smsAddr.replace(/_/g, ",");
        completeAddr = completeAddr.replace(/_/g, ",");
        completeAddr = completeAddr.replace(/'/g, "\\'");
        liData += "<li>"        
        liData += "<h2>"+locations.salonName+"</h2><p>"+locations.salonAddress+", <br/> "+locations.salonCity+", <br/> "+locations.salonState+" <br/> "+locations.salonPincode+"</p>";
        //liData += "<h2>"+locations.salonName+"</h2><p>"+locations.salonAddress+", <br/> "+locations.salonCity;
        liData += "<div class=\"buttons\">"
        liData +="<a href=\"javascript:;\" class=\"call\" data-rel="+salonMobile+" data-content=\""+completeAddr+"\" onclick=\"gtag('event','"+completeAddr+"' , { 'event_category':'Button Click','event_label':'Call' })\">Call</a>"
        if(lat!=14 && lng!=14) { liData += "<a href=\"javascript:;\" class=\"location\" onclick=\"myClick("+cnt+"); gtag('event','"+completeAddr+"' , { 'event_category':'Direction','event_label':'Location' })\">Location</a>"}
        liData += "<a href=\"javascript:;\" class=\"sendToPhone sms\" data-rel="+salonMobile+" data-content=\""+smsAddr+"\">Send to Phone</a>"
        liData += "</div>"

        liData += "</li>"
        cnt++
    });
    allLocationData += UlData+liData+"</ul>"
    
    $(".jspPane").text('')
    $(".jspPane").html(allLocationData)

    $(".searchCount").text('')
    $(".searchCount").text(currLoc)
    $(".searchCount").show();
}

//default map load and initialize in script.js function : $(".dummyClicked").click(function(){
function defaultMap() {
  var defaultmap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.7041, lng: 77.1025},
    zoom: 7
  });
}

var markers = [];

function initMap(lat,lng,data) {
    // init Map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: setCustomZoom(),
        center: {
            lat: lat,
            lng:lng
        }
    });
    
    var infoWindow = new google.maps.InfoWindow();
    
    // marker
    var marker, count, i;
    var image = {
        url: '/images/mapIcon2.png',
        size: new google.maps.Size(30, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 40)
    };

    $.each(data, function(key, locations) {
        i++;
        // set marker with infow window
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations.salonLat, locations.salonLong),
            map: map,
            animation: google.maps.Animation.DROP,
            title: locations.salonName,
            //label: ""+i,
            icon: image
        });

        (function(marker, data) {

            // Attaching a click event to the current marker
            google.maps.event.addListener(marker, "click", function(e) {
                var salonName = "<h2>"+locations.salonName+"</h2><p>"+locations.salonAddress+", <br/> "+locations.salonCity+", <br/> "+locations.salonState+" <br/> "+locations.salonPincode+"</p>";
                //var salonName = "<h2>"+locations.salonName+"</h2><p>"+locations.salonAddress+", <br/> "+locations.salonCity;
                var popVar = "<div class='infoWindow'>"+salonName+"</div>";

                infoWindow.setContent(popVar);
                infoWindow.open(map, marker);
                map.setCenter(marker.getPosition());
                map.setZoom(15);

            });

        })(marker, data);

        markers.push(marker);

    });

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
    markers = [];
}

function myClick(id){
    google.maps.event.trigger(markers[id], 'click');
    windowWidth  = $(window).width()
    if (windowWidth <= 1100) {
        $(".mobileTab ul li").removeClass("active");
        $(".mobileTab ul li.mapView").addClass("active");
        $(".mapViewTab").addClass("active");
    }
}

function setCustomZoom(){
    windowWidth  = $(window).width()
    if (windowWidth <= 1100) {
        return 13
    }
    return 14
}

$(".thankYou").hide();
//Function To enter only numeric
$("#sms_mobile").on("keypress keyup blur",function (event) {
    if (/\D/g.test(this.value)){
        this.value = this.value.replace(/\D/g, '');
    }
});
$('#sendSMS').on('click',function(e) {
    $(".thankYou").hide();
    var valid       = true;
    var mob_pattern = /^\d{10}$/;
    var smsText     = $("#sms_details").val();
    var smsMobile   = $("#sms_mobile").val();
    var data        = {};
    data.sms_details= smsText;
    data.sms_mobile = smsMobile;

    if (smsMobile == '') {
        $('.thankYou').text('Enter your mobile number.').show();
        valid = false;
    }else if (!mob_pattern.test(smsMobile)) {
        $('.thankYou').text('Enter valid mobile number.').show();
        valid = false;
    }

    if(valid == true){
        
        $.ajax({
            async: true,
            cache: false,
            type: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: './sendsms',
            dataType: 'json',
            success: function(result) {
                //console.log(result);
                $(".thankYou").text('Thank You').show();
                $("#sms_mobile").val('');
                $("#sms_mobile").focus();
                gtag('event',smsText , { 'event_category':'Send to Phone','event_label':'Send' })
            },
            error: function(result) {
                $(".thankYou").text('Message not send.').show();
            }
        });
    }
})
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";
import CampusRes from "./campusRes";

function Restaurant(){

    let params = useParams();
    let currentUrl = window.location.href;
    console.log('currentUrl', currentUrl);
    console.log(params['*']);
    //console.log(params['*'] === '' || params['*'] === '신관');
    //console.log(params['*'] === '신관');
    const { kakao } = window;    

    useEffect(() => {
        var container = document.getElementById('map');
        let mapCoor;
        if(params['*'] === '' || params['*'] === '신관'){
            mapCoor = new kakao.maps.LatLng( 36.4689996, 127.1414358 );
        }else {
            mapCoor = new kakao.maps.LatLng( 36.8511811, 127.1511352 );
        }
        
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: mapCoor, //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };
        
        var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        var markerPosition  = mapCoor; 

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
        
        // 지도에 클릭 이벤트를 등록합니다
        // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlng = mouseEvent.latLng; 
        
        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);
        
        var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
        message += '경도는 ' + latlng.getLng() + ' 입니다';
        
        var resultDiv = document.getElementById('clickLatlng'); 
        resultDiv.innerHTML = message;
    
});
        

        //console.log('mapCoor', mapCoor);
    }, [currentUrl]);
    
    
    
    return(
        <div>
            <div>
                <div id="map" style={{width: '500px', height: '500px'}} ></div>
                <div id='clickLatlng'>지도를 클릭해주세요</div>

                
            </div>
            <div>
                <Link to='신관' >신관캠퍼스</Link>
                <Link to='천안'>천안캠퍼스</Link>
            </div>

            <Routes>
                <Route path="신관" element={<CampusRes />} />
                <Route path="천안" element={<CampusRes />} />
            </Routes>
        </div>
        
    )
}

export default Restaurant;
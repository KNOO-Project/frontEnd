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
        
        var kakaoMap = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        var markerPosition  = mapCoor; 

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(kakaoMap);

        //console.log('mapCoor', mapCoor);
    }, [currentUrl]);
    
    
    return(
        <div>
            <div>
                <div id="map" style={{width: '500px', height: '500px'}} ></div>
            <div>open api</div>

                
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
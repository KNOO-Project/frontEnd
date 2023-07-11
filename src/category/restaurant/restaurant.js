import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/restaurants/restaurants.css';

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
            mapCoor = new kakao.maps.LatLng( 36.469421, 127.1406507 );
        }else {
            mapCoor = new kakao.maps.LatLng( 36.8511811, 127.1511352 );
        }
        
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: mapCoor, //지도의 중심좌표.
            level: 4 //지도의 레벨(확대, 축소 정도)
        };
        
        var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        var markerPosition  = mapCoor; 

        // 마커를 생성합니다
        var mainMarker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        mainMarker.setMap(map);
        
        // 지도에 클릭 이벤트를 등록합니다
        // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlng = mouseEvent.latLng; 
        
        // 마커 위치를 클릭한 위치로 옮깁니다
        mainMarker.setPosition(latlng);
        
        var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
        message += '경도는 ' + latlng.getLng() + ' 입니다';
        
        var resultDiv = document.getElementById('clickLatlng'); 
        resultDiv.innerHTML = message;
         
            });
        
        // 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다 
        var positions_kongju = [
            {                                                                               //신관 천안 포지션 구별해서 적용하기
                content: '<div>다복수육국밥</div>', 
                latlng: new kakao.maps.LatLng(36.4732522, 127.1415602)
            },
            {
                content: '<div>롯데리아</div>', 
                latlng: new kakao.maps.LatLng(36.4730706, 127.1407595)
            },
            {
                content: '<div>파스꾸치</div>', 
                latlng: new kakao.maps.LatLng(36.473489, 127.1409026)
            },
            {
                content: '<div>스타벅스</div>', 
                latlng: new kakao.maps.LatLng(36.4679803, 127.1427074)
            },
            {
                content: '<div>도스마스</div>', 
                latlng: new kakao.maps.LatLng(36.4709681, 127.1380492)
            }
        ];

        var positions_cheonan = [
            {                                                                               //신관 천안 포지션 구별해서 적용하기
                content: '<div>롯데리아</div>', 
                latlng: new kakao.maps.LatLng(36.8495709, 127.1550454)
            },
            {
                content: '<div>장원식당</div>', 
                latlng: new kakao.maps.LatLng(36.8498624, 127.1544815)
            },
            {
                content: '<div>한솥도시락</div>', 
                latlng: new kakao.maps.LatLng(36.8502368, 127.1549526)
            },
            {
                content: '<div>파스타랩</div>', 
                latlng: new kakao.maps.LatLng(36.8498624, 127.1544815)
            },
            {
                content: '<div>신당해물칼국수</div>', 
                latlng: new kakao.maps.LatLng(36.8497524, 127.1535756)
            }
        ];

        function createResMarker(positions) {
            for (var i = 0; i < positions.length; i ++) {
                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: positions[i].latlng // 마커의 위치
                });
    
                // 마커에 표시할 인포윈도우를 생성합니다 
                var infowindow = new kakao.maps.InfoWindow({
                    content: positions[i].content // 인포윈도우에 표시할 내용
                });
    
                // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
                // 이벤트 리스너로는 클로저를 만들어 등록합니다 
                // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
            }
        }

        if(params['*'] === '' || params['*'] === '신관'){
            createResMarker(positions_kongju);
        }else {
            createResMarker(positions_cheonan);
        }        


        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
        function makeOverListener(map, marker, infowindow) {
            return function() {
                infowindow.open(map, marker);
            };
        }

        // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
        function makeOutListener(infowindow) {
            return function() {
                infowindow.close();
            };
        }    
        
        var testBtn = document.getElementById('test');
        testBtn.addEventListener('click' ,clickTestBtn);

        function clickTestBtn() {
            console.log('test');
        }

        var zoomInBtn = document.getElementById('zoomIn');
        var zoomOutBtn = document.getElementById('zoomOut');

        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
        // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
        function zoomIn() {
            map.setLevel(map.getLevel() - 1);
        }

        // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
        function zoomOut() {
            map.setLevel(map.getLevel() + 1);
        }

        //console.log('mapCoor', mapCoor);
    }, [currentUrl]);
    
    
    
    return(
        <div>
            <div className="map_box">
                <div className="map_select">
                    <Link className="shinkwan" to='신관' >신관캠퍼스</Link>
                    <br/>
                    <Link className="cheonan" to='천안'>천안캠퍼스</Link>
                </div>
                <div id="map" ></div>
                <div className="custom_zoomControl">
                    <span id="zoomIn"><img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" /></span>  
                    <span id="zoomOut"><img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" /></span>    
                </div>                

                    
                <button id="test" onClick={e => {
                }} >test</button>
            </div>
            <div id='clickLatlng'>지도를 클릭해주세요</div>

            <Routes>
                <Route path="신관" element={<CampusRes />} />
                <Route path="천안" element={<CampusRes />} />
            </Routes>
        </div>
        
    )
}

export default Restaurant;
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/map/map.css';
import {BiRestaurant} from 'react-icons/bi';
import {IoIosCafe} from 'react-icons/io'
import Cafe from "./cafe";
import Res from "./res";
import { NavItem } from "react-bootstrap";

const {naver} = window;

function Map(props){

    let navigate = useNavigate();
    let params = useParams();
    //let currentUrl = window.location.href;
    //console.log('currentUrl', currentUrl);
    console.log(params['*']);
    let [resIconClick, setResIconClick] = useState(false);
    let [detailIconClick, setDetailIconClick] = useState(true);
    //let campus1 = params['*'].split('/')[0];
    //console.log(params['*'] === '' || params['*'] === '신관');
    //console.log(params['*'] === '신관');
    useEffect(() => {
        
        //공주캠퍼스 마커
        var kongjuKoreanResMarker = [];
        var kongjuChineseResMarker = [];
        var kongjuJapaneseResMarker = [];
        var kongjuWesternResMarker = [];
        var kongjuCafeMarker = [];
        var kongjuFastFoodMarker = [];

        //천안캠퍼스 마커
        var cheonanKoreanResMarker = [];
        var cheonanChineseResMarker = [];
        var cheonanJapaneseResMarker = [];
        var cheonanWesternResMarker = [];
        var cheonanCafeMarker = [];
        var cheonanFastFoodMarker = [];

        //공주 캠퍼스
        if(params['*'].includes('공주')){
            axios.get('/api/restaurants', {
                headers: { Authorization: props.cookies.token },
                params: {
                    campus: '공주'
                }
            })
            .then((res) => {
                console.log('공주', res);
                /* 반복문 돌리면서 필터링 해주기 */
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].cuisine_type === '카페'){
                        kongjuCafeMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '한식'){
                        kongjuKoreanResMarker.push(res.data[i]);
                    }else if(res.data.cuisine_type === '일식'){
                        kongjuJapaneseResMarker.push(res.data[i]);
                    }else if(res.data.cuisine_type === '중식'){
                        kongjuChineseResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '양식'){
                        kongjuWesternResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '패스트 푸드'){
                        kongjuFastFoodMarker.push(res.data[i]);
                    }
                    
                }
            })
            .then(() => {

                function createMarker(cafeMarker, i, iconImg, detailIconClick) {
                    console.log('iconImg', iconImg);
                    var marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(cafeMarker[i].coordinate.latitude, cafeMarker[i].coordinate.longitude),
                        map: map,
                        title: 'Green',
                        icon: {
                            content: [
                                '<div class="iw_inner">',
                                `<img src="/img/${iconImg}.png" alt="" />`,
                                `   <h3>${cafeMarker[i].restaurant_name}</h3>`,
                                '</div>'
                            ].join(''),
                            size: new naver.maps.Size(38, 58),
                            anchor: new naver.maps.Point(19, 58),
                        },
                        draggable: false
                    });
        
                    return marker;
                }
                let markerArray = [];
                if(params['*'] === '공주/cafe'){
                    for(var i=0; i<kongjuCafeMarker.length; i++){
                        markerArray.push(createMarker(kongjuCafeMarker, i, 'cafe'));
                    }
                }else if(params['*'] === '공주/한식'){
                    for(var i=0; i<kongjuKoreanResMarker.length; i++){
                        markerArray.push(createMarker(kongjuKoreanResMarker, i, 'res'));
                    }
                }else if(params['*'] === '공주/일식'){
                    for(var i=0; i<kongjuJapaneseResMarker.length; i++){
                        markerArray.push(createMarker(kongjuJapaneseResMarker, i, 'res'));
                    }
                }else if(params['*'] === '공주/양식'){
                    for(var i=0; i<kongjuWesternResMarker.length; i++){
                        markerArray.push(createMarker(kongjuWesternResMarker, i, 'res'));
                    }
                }else if(params['*'] === '공주/중식'){
                    for(var i=0; i<kongjuChineseResMarker.length; i++){
                        markerArray.push(createMarker(kongjuChineseResMarker, i, 'res'));
                    }
                }else if(params['*'] === '공주/패스트푸드'){
                    for(var i=0 ;kongjuFastFoodMarker.length; i++){
                        markerArray.push(createMarker(kongjuFastFoodMarker, i, 'res'));
                    }
                }
                console.log('markerArray', markerArray);
            })
            .catch(() => {
                console.log('err');
            })
        }
        //천안 캠퍼스
        if(params['*'].includes('천안')){
            axios.get('/api/restaurants', {
                headers: { Authorization: props.cookies.token },
                params: {
                    campus: '천안'
                }
            })
            .then((res) => {
                console.log('cheonan', res);
                /* 반복문 돌리면서 필터링 해주기 */
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].cuisine_type === '카페'){
                        cheonanCafeMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '한식'){
                        cheonanKoreanResMarker.push(res.data[i]);
                    }else if(res.data.cuisine_type === '일식'){
                        cheonanJapaneseResMarker.push(res.data[i]);
                    }else if(res.data.cuisine_type === '중식'){
                        cheonanChineseResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '양식'){
                        cheonanWesternResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '패스트 푸드'){
                        cheonanFastFoodMarker.push(res.data[i]);
                    }
                }
            })
            .then(() => {

                function createMarker(cafeMarker, i, iconImg) {
                    console.log('iconImg', iconImg);
                    var marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(cafeMarker[i].coordinate.latitude, cafeMarker[i].coordinate.longitude),
                        map: map,
                        title: 'Green',
                        icon: {
                            content: [
                                '<div class="iw_inner">',
                                `<img src="/img/${iconImg}.png" alt="" />`,
                                `   <h3>${cafeMarker[i].restaurant_name}</h3>`,
                                '</div>'
                            ].join(''),
                            size: new naver.maps.Size(38, 58),
                            anchor: new naver.maps.Point(19, 58),
                        },
                        draggable: false
                    });
        
                    return marker;
                }

                let markerArray = [];
                if(params['*'] === '천안/cafe'){
                    for(var i=0; i<cheonanCafeMarker.length; i++){
                        markerArray.push(createMarker(cheonanCafeMarker, i, 'cafe'));
                    }
                }else if(params['*'] === '천안/한식'){
                    for(var i=0; i<cheonanKoreanResMarker.length; i++){
                        markerArray.push(createMarker(cheonanKoreanResMarker, i, 'res'));
                    }
                }else if(params['*'] === '천안/일식'){
                    for(var i=0; i<cheonanJapaneseResMarker.length; i++){
                        markerArray.push(createMarker(cheonanJapaneseResMarker, i, 'res'));
                    }
                }else if(params['*'] === '천안/양식'){
                    for(var i=0; i<cheonanWesternResMarker.length; i++){
                        markerArray.push(createMarker(cheonanWesternResMarker, i, 'res'));
                    }
                }else if(params['*'] === '천안/중식'){
                    for(var i=0; i<cheonanChineseResMarker.length; i++){
                        markerArray.push(createMarker(cheonanChineseResMarker, i, 'res'));
                    }
                }else if(params['*'] === '천안/패스트푸드') {
                    for(var i=0; i<cheonanFastFoodMarker.length; i++)
                    markerArray.push(createMarker(cheonanFastFoodMarker, i, 'res'));
                }
                console.log('markerArray', markerArray);
            })
            .catch(() => {
                console.log('err');
            })
        }
        /* axios.get('/api/restaurants', {
            headers: { Authorization: props.cookies.token }
        })
        .then((res) => {
            console.log(res.data);
            
            
            for(var i=0; i<res.data.length; i++){
                if(res.data[i].cuisine_type === '카페'){
                    kongjuCafeMarker.push(res.data[i]);
                }else if(res.data[i].cuisine_type === '한식'){
                    kongjuKoreanResMarker.push(res.data[i]);
                }else if(res.data.cuisine_type === '일식'){
                    kongjuJapaneseResMarker.push(res.data[i]);
                }else if(res.data.cuisine_type === '중식'){
                    kongjuChineseResMarker.push(res.data[i]);
                }else if(res.data[i].cuisine_type === '양식'){
                    kongjuWesternResMarker.push(res.data[i]);
                }
            }

            console.log("kongjKoreanResMarker", kongjuKoreanResMarker);
            console.log('kongjuCafeMarker', kongjuCafeMarker);
            console.log('kongjuChineseResMarker', kongjuChineseResMarker);
            console.log('kongjuJapaneseResMarker', kongjuJapaneseResMarker);
            console.log('kongjuWesternResMarker', kongjuWesternResMarker);
            
        }) */
        
        

        var mapDiv = document.getElementById('map');
        
        let campus = new naver.maps.LatLng(36.469421, 127.1406507);
        if(params['*'].includes('천안')) {
            campus = new naver.maps.LatLng(36.8511811, 127.1511352);
        }

        var map = new naver.maps.Map(mapDiv, {
            center:  campus,
            zoomControl: true,
            zoomControlOptions: { //줌 컨트롤의 옵션
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.TOP_RIGHT
            }
        });

        var mainMarkerOptions = {
            position: campus,
            map: map
        }

        /* 
        36.4679803!4d127.1427074 스벅
        36.4729509!4d127.1416383 이디야
        36.4738035!4d127.1371543 미세스피베리
        36.4746!4d127.140123 스벅
        36.4687317!4d127.1404852 프린세스
        36.4696239!4d127.1394378 레브
        */

        /* var singwanCafeMarker = [

            [
                {position: new naver.maps.LatLng(36.4746, 127.140123)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>스타벅스</h3>',
                    '</div>'
                ]       
            ],
            [
                {position: new naver.maps.LatLng(36.4729509, 127.1416383)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>이디야</h3>',
                    '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4738035, 127.1371543)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>미세스피베리</h3>',
                    '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4679803, 127.1427074)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>레브</h3>',
                    '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4687317, 127.1404852)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>프린세스</h3>',
                    '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4696239, 127.1394378)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>스타벅스</h3>',
                    '</div>'
            ]
            ]
            
        ]; */

        /* 
        36.4695256!4d127.1376681 찐돈가스
        36.4708549!4d127.1381369 파스타쿠치나
        36.4727017!4d127.1432021 부엉이식당
        36.4732522!4d127.1415602 다복수육국밥
        36.4736877!4d127.1402451 맘스터치
        36.4738207!4d127.1397007 국수정
        */
        var singwanResMarker = [
            [
                {position: new naver.maps.LatLng(36.4695256, 127.1376681)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>찐돈가스</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.4708549, 127.1381369)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>파스타쿠치나</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.4727017, 127.1432021)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>부엉이식당</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.4732522, 127.1415602)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>다복수육국밥</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.4736877, 127.1402451)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>맘스터치</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.4738207, 127.1397007)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>국수정</h3>',
                    '</div>'
                ]
            ]
        ]

        /* 
       36.8511811!4d127.1511352 클라우드 나인
       36.8426071!4d127.1516687 카페 카키
       127.154690, Y :36.8499386 팝카페
       127.148625, Y :36.8505861 포롱
       127.155214, Y :36.8539118 스윗포레스트
       */
        var cheonanCafeMarker = [
            [
                {position: new naver.maps.LatLng(36.8511811, 127.1511352)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>클라우드나인</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8426071, 127.1516687)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>카페 카키</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8499386, 127.154690)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>팝카페</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8505861, 127.148625)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>포롱</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8539118, 127.155214)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/cafe.png" alt="" />',
                    '   <h3>스윗포레스트</h3>',
                    '</div>'
                ]
            ]
        ]

        /* 
        36.8497524!4d127.1535756 신당해물칼국수
        36.8501581!4d127.1555891 맘스터치
        36.8505588!4d127.155659 이모네 식당
        36.8502368!4d127.1549526 한솥도시락
        36.8495709!4d127.1550454 롯데리아
        36.8498624!4d127.1544815 파스타랩
        36.8498624!4d127.1544815 장원식당
        */
        var cheonanResMarker = [
            [
                {position: new naver.maps.LatLng(36.8497524, 127.1535756)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>신당해물칼국수</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8501581, 127.1555891)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>맘스터치</h3>',
                    '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8495709, 127.1550454)}
                ,[
                    '<div class="iw_inner">',
                    '<img src="/img/res.png" alt="" />',
                    '   <h3>롯데리아</h3>',
                    '</div>'
                ]
            ]
        ]
    
        if(params['*'] === '공주' || params['*'] === '천안'){
            var mainMarker = new naver.maps.Marker(mainMarkerOptions);
        }

    }, [params['*']]);
    
    
    return(
        <div className="map_body">
        {detailIconClick ? 
            <div className="info_box">
            <li>스타벅스 공주신관점</li>
            <li>영업시간: 9시 ~ 18시</li>
            <li>주소: </li>
            </div> : null}    
        
        <div className="map_box">
            <div className="campus_btn">
                <Link to='공주' onClick={e => {
                    setResIconClick(false);
                }}>신관캠퍼스</Link>
                <Link to='천안' onClick={e => {
                    setResIconClick(false);
                }}>천안캠퍼스</Link>
            </div>
            <div id="map" ></div>
            <div className="map_navbar">
                <div className="map_icon_box">
                    <div className="res_icon" onClick={e => {
                        setResIconClick(prev => !prev);
                    }}><span><BiRestaurant style={{color: 'orange'}} /></span><li>res</li>
                    </div>
                    <div className="cafe_icon" onClick={e => {
                        setResIconClick(false);
                        if(params['*'].includes('천안')){
                            if(params['*'] === '천안/cafe'){
                                navigate('천안');
                            }else {
                                navigate('천안/cafe');
                            }
                        }else{
                            if(params['*'] === '공주/cafe'){
                                navigate('공주');
                            }else {
                                navigate('공주/cafe');
                            }
                        }
                    }}><span><IoIosCafe style={{color: 'orange'}} /></span><li>cafe</li>
                    </div>
                </div>
                {resIconClick ? 
                <>
                <div className="res_box">
                    <div onClick={e => {
                        if(params['*'].includes('천안')){
                            navigate('천안/한식');
                        }else if(params['*'].includes('공주')){
                            navigate('공주/한식');
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>한식</li>
                    </div>
                    <div onClick={e => {
                        if(params['*'].includes('천안')){
                            navigate('천안/양식');
                        }else if(params['*'].includes('공주')){
                            navigate('공주/양식');
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>양식</li>
                    </div>
                    <div onClick={e => {
                        if(params['*'].includes('천안')){
                            navigate('천안/일식');
                        }else if(params['*'].includes('공주')){
                            navigate('공주/일식');
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>일식</li>
                    </div>
                    <div onClick={e => {
                        if(params['*'].includes('천안')){
                            navigate('천안/중식');
                        }else if(params['*'].includes('공주')){
                            navigate('공주/중식');
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>중식</li>
                    </div>
                    <div onClick={e => {
                        if(params['*'].includes('천안')){
                            navigate('천안/패스트푸드');
                        }else if(params['*'].includes('공주')){
                            navigate('공주/패스트푸드');
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>패스트푸드</li>
                    </div>
                </div>
                </> 
                : null}
            </div>
                
            <Routes>
                <Route path="공주/*" element={<CampusRes />} />
                <Route path="천안/*" element={<CampusRes />} />
                <Route path="신관/cafe" element={<Cafe />} />
                <Route path="천안/cafe" element={<Cafe />} />
                <Route path="공주/한식" element={<Res />} />
                <Route path="공주/중식" element={<Res />} />
                <Route path="공주/일식" element={<Res />} />
                <Route path="공주/양식" element={<Res />} />
                <Route path="공주/패스트푸드" element={<Res />} />
                <Route path="천안/한식" element={<Res />} />
                <Route path="천안/중식" element={<Res />} />
                <Route path="천안/일식" element={<Res />} />
                <Route path="천안/양식" element={<Res />} />
                <Route path="공주/패스트푸드" element={<Res />} />
            </Routes>
        </div>
        </div>
        
    )
}

export default Map;
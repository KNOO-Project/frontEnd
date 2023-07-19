import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/map/map.css';
import {BiRestaurant} from 'react-icons/bi';
import {IoIosCafe} from 'react-icons/io'
import Cafe from "./cafe";

const {naver} = window;
function Map(){

    let navigate = useNavigate();
    let params = useParams();
    let currentUrl = window.location.href;
    //console.log('currentUrl', currentUrl);
    console.log(params['*']);

    //let campus1 = params['*'].split('/')[0];
    //console.log(params['*'] === '' || params['*'] === '신관');
    //console.log(params['*'] === '신관');
    useEffect(() => {

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

        var singwanCafeMarker = [

            [
                {position: new naver.maps.LatLng(36.4746, 127.140123)}
                ,[
                    '<div class="iw_inner">',
                    '   <h3>스타벅스</h3>',
                    '</div>'
                ]       
            ],
            [
                {position: new naver.maps.LatLng(36.4729509, 127.1416383)}
                ,[
                    '<div class="iw_inner">',
                    '   <h3>이디야</h3>',
                    '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4738035, 127.1371543)}
                ,[
                    '<div class="iw_inner">',
                    '   <h3>미세스피베리</h3>',
                    '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4679803, 127.1427074)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>레브</h3>',
                '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4687317, 127.1404852)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>프린세스</h3>',
                '</div>'
            ]
            ],
            [
                {position: new naver.maps.LatLng(36.4696239, 127.1394378)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>스타벅스</h3>',
                '</div>'
            ]
            ]
            
        ];

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
                '   <h3>클라우드나인</h3>',
                '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8426071, 127.1516687)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>카페 카키</h3>',
                '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8499386, 127.154690)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>팝카페</h3>',
                '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8505861, 127.148625)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>포롱</h3>',
                '</div>'
                ]
            ],
            [
                {position: new naver.maps.LatLng(36.8539118, 127.155214)}
                ,[
                    '<div class="iw_inner">',
                '   <h3>스윗포레스트</h3>',
                '</div>'
                ]
            ]
        ]
    
        function createMarker(cafeMarker, i) {
            var marker = new naver.maps.Marker({
                position: cafeMarker[i][0].position,
                map: map,
                title: 'Green',
                icon: {
                    content: cafeMarker[i][1].join(''),
                    size: new naver.maps.Size(38, 58),
                    anchor: new naver.maps.Point(19, 58),
                },
                draggable: true
            });

            return marker;
        }

        let array = [];

        if(params['*'] === '천안/cafe'){
            for(var i=0; i<cheonanCafeMarker.length; i++){
                array.push((createMarker(cheonanCafeMarker, i)));
            }
            console.log('천안')
        }else if(params['*'] === '신관/cafe'){
            for(var j=0; j<singwanCafeMarker.length; j++){
                array.push((createMarker(singwanCafeMarker, j)));
            }
            console.log('신관');
        }
        
        
        /* var greenMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(36.4687317, 127.1404852),
            map: map,
            title: 'Green',
            icon: {
                content: [
                            '<div class="iw_inner">',
                            '   <h3>5서울특별시청</h3>',
                            '</div>'
                        ].join(''),
                size: new naver.maps.Size(38, 58),
                anchor: new naver.maps.Point(19, 58),
            },
            draggable: true
        });

        var pinkMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(36.4696239, 127.1394378),
            map: map,
            title: 'Green',
            icon: {
                content: contentString[2].join(''),
                size: new naver.maps.Size(38, 58),
                anchor: new naver.maps.Point(19, 58),
            },
            draggable: true
        }); */

        var mainMarker = new naver.maps.Marker(mainMarkerOptions);

    }, [params['*']]);
    
    
    
    return(
        <div className="map_box">
            <div className="campus_btn">
                <Link to='신관'>신관캠퍼스</Link>
                <Link to='천안'>천안캠퍼스</Link>
            </div>
            <div id="map" ></div>
            <div className="map_navbar">
                <div className="res_icon"><span><BiRestaurant style={{color: 'orange'}} /></span><li>res</li></div>
                <div className="cafe_icon" onClick={e => {
                    if(params['*'].includes('천안')){
                        if(params['*'] === '천안/cafe'){
                            navigate('천안');
                        }else {
                            navigate('천안/cafe');
                        }
                    }else{
                        if(params['*'] === '신관/cafe'){
                            navigate('신관');
                        }else {
                            navigate('신관/cafe');
                        }
                    }
                }}><span><IoIosCafe style={{color: 'orange'}} /></span><li>cafe</li></div>
            </div>
                

            <Routes>
                <Route path="신관/*" element={<CampusRes />} />
                <Route path="천안/*" element={<CampusRes />} />
                <Route path="신관/cafe" element={<Cafe />} />
                <Route path="천안/cafe" element={<Cafe />} />
            </Routes>
        </div>
        
    )
}

export default Map;
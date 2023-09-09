import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/map/map.css';
import {BiRestaurant} from 'react-icons/bi';
import {IoIosCafe} from 'react-icons/io';
import {IoCloseOutline} from 'react-icons/io5';
import Cafe from "./cafe";
import Res from "./res";
import { useRef } from 'react';
import { TailSpin } from 'react-loader-spinner';
import * as makeCluster from './markerClusterFunction.js';
const {naver} = window;

function Map(props){
    
    var token = props.token;
    const cafeIconUrl = 'https://map.pstatic.net/resource/api/v2/image/maps/around-category/cafe_category_pc@2x.png?version=3';
    const resIconUrl = 'https://map.pstatic.net/resource/api/v2/image/maps/around-category/dining_category_pc@2x.png?version=3';
    //console.log('token', token);
    let navigate = useNavigate();
    let params = useParams();
    //let currentUrl = window.location.href;
    //console.log('currentUrl', currentUrl);
    console.log('params', params);
    let [resIconClick, setResIconClick] = useState(false);
    let [url, setUrl] = useState(null);
    /* markerClustering 함수 가져오기 */
    const MarkerClustering = makeCluster.makeMarkerClustering(window.naver);
    const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

    useEffect(() => {
        /* 맛집 클릭하면 옆에 창 닫기 */
        if(!params['*']){
            setUrl(null);   
            setResIconClick(false);
        }
        //공주캠퍼스 마커
        var allKongjuMarker = [];
        var kongjuKoreanResMarker = [];
        var kongjuChineseResMarker = [];
        var kongjuJapaneseResMarker = [];
        var kongjuWesternResMarker = [];
        var kongjuCafeMarker = [];
        var kongjuFastFoodMarker = [];
        var markerData = null;
        //천안캠퍼스 마커
        var allCheonanMarker = [];
        var cheonanKoreanResMarker = [];
        var cheonanChineseResMarker = [];
        var cheonanJapaneseResMarker = [];
        var cheonanWesternResMarker = [];
        var cheonanCafeMarker = [];
        var cheonanFastFoodMarker = [];
        //cafe or res 마커 담을 배열
        let markerArray = [];
        let markerHtmlArray = [];


        function createMarker(placeMarker, i, iconUrl) {
            let name = null;
            if(placeMarker[i].restaurant_name.length > 8){
                name = placeMarker[i].restaurant_name.substring(0, 7) + '...';
            }else {
                name = placeMarker[i].restaurant_name;
            }
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(placeMarker[i].coordinate.latitude, placeMarker[i].coordinate.longitude),
                map: map,
                title: 'Green',
                icon: {
                    content: [
                        `<div id=${i} class="iw_inner" >`,
                        `<img src="${iconUrl}" alt="" />`,
                        `   <h3>${name}</h3>`,
                        '</div>'
                    ].join(''),
                    size: new naver.maps.Size(38, 58),
                    anchor: new naver.maps.Point(19, 58),
                },
                draggable: false
            });

            return marker;
        }

        function showAllMarker(markerArray, marker) {
            for(var i=0; i<marker.length; i++){
                if(marker[i].cuisine_type === '카페'){
                    markerArray.push(createMarker(marker, i, cafeIconUrl));
                }else {
                    markerArray.push(createMarker(marker, i, resIconUrl));
                }
                
            }
            markerData = marker;
        }
        
        function showcafeMarker(markerArray, marker) {
            for(var i=0; i<marker.length; i++){
                markerArray.push(createMarker(marker, i, cafeIconUrl));
            }
            markerData = marker;
        }

        function showResMarker(markerArray, marker) {
            for(var i=0; i<marker.length; i++){
                markerArray.push(createMarker(marker, i, resIconUrl));
            }
            markerData = marker;
        }

        function getResUrlData(markerData, markerHtmlArray) {
            for(var i=0; i<markerHtmlArray.length; i++){ 
                let num = i;   
                naver.maps.Event.addDOMListener( markerHtmlArray[i] , 'click', function() {
                    //console.log(markerData[num].url);
                    setUrl(markerData[num].url);
                })
            }
        }

        var htmlMarker1 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-1.png);background-size:contain;"></div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20)
        },
        htmlMarker2 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-2.png);background-size:contain;"></div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20)
        },
        htmlMarker3 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-3.png);background-size:contain;"></div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20)
        },
        htmlMarker4 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-4.png);background-size:contain;"></div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20)
        },
        htmlMarker5 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-5.png);background-size:contain;"></div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20)
        };

        var mapDiv = document.getElementById('map');
        /* 36.4732522!4d127.1415602 */
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

        const cluster = new MarkerClustering({
            minClusterSize: 2,
            maxZoom: 18,
            map: map,
            markers: markerArray,
            disableClickZoom: false,
            gridSize: 120,
            icons: [
              htmlMarker1,
              htmlMarker2,
              htmlMarker3,
              htmlMarker4,
              htmlMarker5,
            ],
            indexGenerator: [10, 100, 200, 500, 1000],
            stylingFunction: function (clusterMarker, count) {
              // without jquery $(clusterMarker.getElement()).find('div:first-child').text(count)
              clusterMarker
                .getElement()
                .querySelector('div:first-child').innerText = count
            },
          })
        
        //공주 캠퍼스
        if(params['*'].includes('공주') || params['*'] === ''){
            axios.get(`${PROXY}/api/restaurants`, {
                headers: { Authorization:token },
                params: {
                    campus: '공주'
                }
            })
            .then((res) => {
                console.log('공주', res);
                //console.log(res.data[0].url);
                //전체 데이터 넣어주기
                for(var i=0; i<res.data.length; i++){
                    allKongjuMarker.push(res.data[i]);
                }
                /* 반복문 돌리면서 필터링 해주기 */
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].cuisine_type === '카페'){
                        kongjuCafeMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '한식'){
                        kongjuKoreanResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '일식'){
                        kongjuJapaneseResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '중식'){
                        kongjuChineseResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '양식'){
                        kongjuWesternResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '패스트 푸드'){
                        kongjuFastFoodMarker.push(res.data[i]);
                    }
                    
                }
                console.log('allKongjuMarker', allKongjuMarker);
            })
            .then((res) => {
                console.log('res2', res);
                console.log('allKongjuMarker', allKongjuMarker);
                
                if(params['*'] === '' || params['*'] === '공주'){
                    showAllMarker(markerArray, allKongjuMarker);
                }
                if(params['*'] === '공주/cafe'){
                    showcafeMarker(markerArray, kongjuCafeMarker);
                }else if(params['*'] === '공주/한식'){
                    showResMarker(markerArray, kongjuKoreanResMarker);
                }else if(params['*'] === '공주/일식'){
                    showResMarker(markerArray, kongjuJapaneseResMarker);
                }else if(params['*'] === '공주/양식'){
                    showResMarker(markerArray, kongjuWesternResMarker);
                }else if(params['*'] === '공주/중식'){
                    showResMarker(markerArray, kongjuChineseResMarker);
                }else if(params['*'] === '공주/패스트푸드'){
                    showResMarker(markerArray, kongjuFastFoodMarker);
                }
                console.log('markerArray', markerArray);
                console.log('markerData', markerData);
                for(var j=0; j<markerArray.length; j++){
                    var markerHtml = document.getElementById(j);
                    markerHtmlArray.push(markerHtml);
                }
                //console.log(markerHtmlArray);
                

                getResUrlData(markerData, markerHtmlArray);
                
                
            })
            .catch(() => {
                console.log('err');
            })
        }
        //천안 캠퍼스
        if(params['*'].includes('천안')){
            axios.get(`${PROXY}/api/restaurants`, {
                headers: { Authorization: token },
                params: {
                    campus: '천안'
                }
            })
            .then((res) => {
                console.log('cheonan', res);
                //전체 데이터 넣어주기
                for(var i=0; i<res.data.length; i++){
                    allCheonanMarker.push(res.data[i]);
                }
                /* 반복문 돌리면서 필터링 해주기 */
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].cuisine_type === '카페'){
                        cheonanCafeMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '한식'){
                        cheonanKoreanResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '일식'){
                        cheonanJapaneseResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '중식'){
                        cheonanChineseResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '양식'){
                        cheonanWesternResMarker.push(res.data[i]);
                    }else if(res.data[i].cuisine_type === '패스트 푸드'){
                        cheonanFastFoodMarker.push(res.data[i]);
                    }
                }
                console.log('cheonanKoreanResMarker', cheonanKoreanResMarker);
            })
            .then(() => {
                
                
                if(params['*'] === '천안'){
                    showAllMarker(markerArray, allCheonanMarker);
                }else if(params['*'] === '천안/cafe'){
                    showcafeMarker(markerArray, cheonanCafeMarker);
                }else if(params['*'] === '천안/한식'){
                    showResMarker(markerArray, cheonanKoreanResMarker);
                }else if(params['*'] === '천안/일식'){
                    showResMarker(markerArray, cheonanJapaneseResMarker);
                }else if(params['*'] === '천안/양식'){
                    showResMarker(markerArray, cheonanWesternResMarker);
                }else if(params['*'] === '천안/중식'){
                    showResMarker(markerArray, cheonanChineseResMarker);
                }else if(params['*'] === '천안/패스트푸드') {
                    showResMarker(markerArray, cheonanFastFoodMarker);
                }
                console.log('markerArray', markerArray);
                console.log('markerData', markerData);
                for(var j=0; j<markerArray.length; j++){
                    var markerHtml = document.getElementById(j);
                    markerHtmlArray.push(markerHtml);
                }
                //console.log(markerHtmlArray);
                
                getResUrlData(markerData, markerHtmlArray);
                
            })
            .catch(() => {
                console.log('err');
            })
        }
                
        

          //console.log(map.getMaxZoom());

        

        /* var cheonanCampus = document.getElementById('cheonanCampus');

        naver.maps.Event.addDOMListener( cheonanCampus, 'click', function() {
            map.setCenter(new naver.maps.LatLng(36.8511811, 127.1511352));
        } ) */
        //굳이 마커를 찍을 필요가 없어 보임
        /* var mainMarkerOptions = {
            position: campus,
            map: map
        }

        console.log('map', map);
        if(params['*'] === '공주' || params['*'] === '천안'){
            var mainMarker = new naver.maps.Marker(mainMarkerOptions);
        } */


        //map.setCenter(new naver.maps.LatLng(33.3590628, 126.534361));
        return () => {
            map.destroy();
        }

    }, [params] );
    
    return(
        <div className="map_body">
            {url === null ? null : 
            <div className="modal_box">
                <div className="modal_url">
                    <TailSpin className="loading_icon" />
                    <iframe className="modal_page" id='frame' src={url} loading="lazy"  title="explain" />
                </div>    
                <div className="close_icon" onClick={e => {
                    setUrl(null);
                }} >
                    <IoCloseOutline />
                </div>
            </div>
            }
        <div className="map_box">
            <div className="campus_btn">
                <Link to='공주' onClick={e => {
                    setUrl(null);
                    setResIconClick(false);
                }}>신관캠퍼스</Link>
                <Link to='천안' onClick={e => {
                    setUrl(null);
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
                        setUrl(null);
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
                        setUrl(null);
                        if(params['*'].includes('천안')){
                            navigate('천안/한식');
                            setResIconClick(false);
                        }else{
                            navigate('공주/한식');
                            setResIconClick(false);
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>한식</li>
                    </div>
                    <div onClick={e => {
                        setUrl(null);
                        if(params['*'].includes('천안')){
                            navigate('천안/양식');
                            setResIconClick(false);
                        }else{
                            navigate('공주/양식');
                            setResIconClick(false);
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>양식</li>
                    </div>
                    <div onClick={e => {
                        setUrl(null);
                        if(params['*'].includes('천안')){
                            navigate('천안/일식');
                            setResIconClick(false);
                        }else{
                            navigate('공주/일식');
                            setResIconClick(false);
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>일식</li>
                    </div>
                    <div onClick={e => {
                        setUrl(null);
                        if(params['*'].includes('천안')){
                            navigate('천안/중식');
                            setResIconClick(false);
                        }else{
                            navigate('공주/중식');
                            setResIconClick(false);
                        }
                    }}>
                        <span><BiRestaurant style={{color: 'orange'}} /></span><li>중식</li>
                    </div>
                    <div onClick={e => {
                        setUrl(null);
                        if(params['*'].includes('천안')){
                            navigate('천안/패스트푸드');
                            setResIconClick(false);
                        }else{
                            navigate('공주/패스트푸드');
                            setResIconClick(false);
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
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/map/map.css';
import {BiRestaurant} from 'react-icons/bi';
import {IoIosCafe} from 'react-icons/io'
import Cafe from "./cafe";
import Res from "./res";

const {naver} = window;

function Map(props){

    let testUrl = null;
    let navigate = useNavigate();
    let params = useParams();
    //let currentUrl = window.location.href;
    //console.log('currentUrl', currentUrl);
    console.log('params', params['*']);
    let [resIconClick, setResIconClick] = useState(false);
    let [url, setUrl] = useState(null);
    
    //let campus1 = params['*'].split('/')[0];
    //console.log(params['*'] === '' || params['*'] === '신관');
    //console.log(params['*'] === '신관');
    useEffect(() => {
        
        /* 맛집 클릭하면 옆에 창 닫기 */
        if(!params['*']){
            setUrl(null);   
            setResIconClick(false);
        }
        //공주캠퍼스 마커
        var kongjuKoreanResMarker = [];
        var kongjuChineseResMarker = [];
        var kongjuJapaneseResMarker = [];
        var kongjuWesternResMarker = [];
        var kongjuCafeMarker = [];
        var kongjuFastFoodMarker = [];
        var markerData = null;
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
                console.log(res.data[0].url);
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

                function createMarker(cafeMarker, i, iconImg) {
                    let name = null;
                    if(cafeMarker[i].restaurant_name.length > 8){
                        name = cafeMarker[i].restaurant_name.substring(0, 7) + '...';
                    }else {
                        name = cafeMarker[i].restaurant_name;
                    }
                    console.log('iconImg', iconImg);
                    var marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(cafeMarker[i].coordinate.latitude, cafeMarker[i].coordinate.longitude),
                        map: map,
                        title: 'Green',
                        icon: {
                            content: [
                                `<div id=${i} class="iw_inner" >`,
                                `<img src="/img/${iconImg}.png" alt="" />`,
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
                let markerArray = [];
                let markerHtmlArray = [];
                if(params['*'] === '공주/cafe'){
                    for(var i=0; i<kongjuCafeMarker.length; i++){
                        markerArray.push(createMarker(kongjuCafeMarker, i, 'cafe'));
                    }
                    markerData = kongjuCafeMarker;
                }else if(params['*'] === '공주/한식'){
                    for(var i=0; i<kongjuKoreanResMarker.length; i++){
                        markerArray.push(createMarker(kongjuKoreanResMarker, i, 'res'));
                    }
                    markerData = kongjuKoreanResMarker;
                }else if(params['*'] === '공주/일식'){
                    for(var i=0; i<kongjuJapaneseResMarker.length; i++){
                        markerArray.push(createMarker(kongjuJapaneseResMarker, i, 'res'));
                    }
                    markerData = kongjuJapaneseResMarker;
                }else if(params['*'] === '공주/양식'){
                    for(var i=0; i<kongjuWesternResMarker.length; i++){
                        markerArray.push(createMarker(kongjuWesternResMarker, i, 'res'));
                    }
                    markerData = kongjuWesternResMarker;
                }else if(params['*'] === '공주/중식'){
                    for(var i=0; i<kongjuChineseResMarker.length; i++){
                        markerArray.push(createMarker(kongjuChineseResMarker, i, 'res'));
                    }
                    markerData = kongjuChineseResMarker;
                }else if(params['*'] === '공주/패스트푸드'){
                    for(var i=0 ;kongjuFastFoodMarker.length; i++){
                        markerArray.push(createMarker(kongjuFastFoodMarker, i, 'res'));
                    }
                    markerData = kongjuFastFoodMarker;
                }
                console.log('markerArray', markerArray);
                console.log('markerData', markerData);
                for(var j=0; j<markerArray.length; j++){
                    var markerHtml = document.getElementById(j);
                    markerHtmlArray.push(markerHtml);
                }
                console.log(markerHtmlArray);
                /* let a = document.getElementById(0);
                naver.maps.Event.addDOMListener( a , 'click', function() {
                    console.log(a);
                }) */
                function getResUrlData(markerData) {
                    for(var i=0; i<markerHtmlArray.length; i++){ 
                        let num = i;   
                        naver.maps.Event.addDOMListener( markerHtmlArray[i] , 'click', function() {
                            console.log(markerData[num].url);
                            setUrl(markerData[num].url);
                        })
                    }
                }

                getResUrlData(markerData);
                
                
                /* for(var j=0; j<markerArray.length; j++){
                    naver.maps.Event.addListener('click' ,
                        function(e) {
                            console.log(e);
                        },
                        markerHtmlArray[j])
                } */
                
                /* j 확인하고  markerArray[k].restaurant_name === title 제대로 맞추기 */
                
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
                    let name = null;
                    if(cafeMarker[i].restaurant_name.length > 9){
                        name = cafeMarker[i].restaurant_name.substring(0, 8) + '...';
                    }else {
                        name = cafeMarker[i].restaurant_name;
                    }
                    var marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(cafeMarker[i].coordinate.latitude, cafeMarker[i].coordinate.longitude),
                        map: map,
                        title: 'Green',
                        icon: {
                            content: [
                                `<div id=${i} class="iw_inner">`,
                                `<img src="/img/${iconImg}.png" alt="" />`,
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

                let markerArray = [];
                let markerHtmlArray = [];
                if(params['*'] === '천안/cafe'){
                    for(var i=0; i<cheonanCafeMarker.length; i++){
                        markerArray.push(createMarker(cheonanCafeMarker, i, 'cafe'));
                    }
                    markerData = cheonanCafeMarker;
                }else if(params['*'] === '천안/한식'){
                    for(var i=0; i<cheonanKoreanResMarker.length; i++){
                        markerArray.push(createMarker(cheonanKoreanResMarker, i, 'res'));
                    }
                    markerData = cheonanKoreanResMarker;
                }else if(params['*'] === '천안/일식'){
                    for(var i=0; i<cheonanJapaneseResMarker.length; i++){
                        markerArray.push(createMarker(cheonanJapaneseResMarker, i, 'res'));
                    }
                    markerData = cheonanJapaneseResMarker;
                }else if(params['*'] === '천안/양식'){
                    for(var i=0; i<cheonanWesternResMarker.length; i++){
                        markerArray.push(createMarker(cheonanWesternResMarker, i, 'res'));
                    }
                    markerData = cheonanWesternResMarker;
                }else if(params['*'] === '천안/중식'){
                    for(var i=0; i<cheonanChineseResMarker.length; i++){
                        markerArray.push(createMarker(cheonanChineseResMarker, i, 'res'));
                    }
                    markerData = cheonanChineseResMarker;
                }else if(params['*'] === '천안/패스트푸드') {
                    for(var i=0; i<cheonanFastFoodMarker.length; i++){
                        markerArray.push(createMarker(cheonanFastFoodMarker, i, 'res'));
                    }
                    markerData = cheonanFastFoodMarker;
                }
                console.log('markerArray', markerArray);
                console.log('markerData', markerData);
                for(var j=0; j<markerArray.length; j++){
                    var markerHtml = document.getElementById(j);
                    markerHtmlArray.push(markerHtml);
                }
                console.log(markerHtmlArray);
                /* let a = document.getElementById(0);
                naver.maps.Event.addDOMListener( a , 'click', function() {
                    console.log(a);
                }) */
                function getResUrlData(markerData) {
                    for(var i=0; i<markerHtmlArray.length; i++){ 
                        let num = i;   
                        naver.maps.Event.addDOMListener( markerHtmlArray[i] , 'click', function() {
                            console.log(markerData[num].url);
                            setUrl(markerData[num].url);
                        })
                    }
                }

                getResUrlData(markerData);
            })
            .catch(() => {
                console.log('err');
            })
        }
                
        

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

    }, [params['*']] );
    
    
    return(
        <div className="map_body">
            {url === null ? null : 
            <div className="test_box">
                <iframe className="modal_page" src={url} title="explain" />
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
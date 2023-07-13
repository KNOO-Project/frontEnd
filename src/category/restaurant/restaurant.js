import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/restaurants/restaurants.css';
import {BiRestaurant} from 'react-icons/bi';
import {IoIosCafe} from 'react-icons/io'

const {naver} = window;
function Restaurant(){

    let params = useParams();
    let currentUrl = window.location.href;
    console.log('currentUrl', currentUrl);
    console.log(params['*']);
    //console.log(params['*'] === '' || params['*'] === '신관');
    //console.log(params['*'] === '신관');
    useEffect(() => {

        var mapDiv = document.getElementById('map');
        
        let campus = new naver.maps.LatLng(36.469421, 127.1406507);
        if(params['*'] === '천안') {
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

        var marker = new naver.maps.Marker(mainMarkerOptions);

        
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
                <div className="cafe_icon"><span><IoIosCafe style={{color: 'orange'}} /></span><li>cafe</li></div>
            </div>
                

            <Routes>
                <Route path="신관" element={<CampusRes />} />
                <Route path="천안" element={<CampusRes />} />
            </Routes>
        </div>
        
    )
}

export default Restaurant;
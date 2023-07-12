import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";
import CampusRes from "./campusRes";
import '../../category-css/restaurants/restaurants.css';

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
                position: naver.maps.Position.TOP_RIGHT
            }
        });

        var marker = new naver.maps.Marker({
            position: campus,
            map: map
        });
    }, [params['*']]);
    
    
    
    return(
        <div className="map_box">
            <div className="campus_btn">
                <Link to='신관'>신관캠퍼스</Link>
                <Link to='천안'>천안캠퍼스</Link>
            </div>
            <div id="map" ></div>
                

            <Routes>
                <Route path="신관" element={<CampusRes />} />
                <Route path="천안" element={<CampusRes />} />
            </Routes>
        </div>
        
    )
}

export default Restaurant;
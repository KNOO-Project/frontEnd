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
               
        var map = new naver.maps.Map(mapDiv);;
    }, []);
    
    
    
    return(
        <div className="map_box">
            <div id="map" ></div>
                

            <Routes>
                <Route path="신관" element={<CampusRes />} />
                <Route path="천안" element={<CampusRes />} />
            </Routes>
        </div>
        
    )
}

export default Restaurant;
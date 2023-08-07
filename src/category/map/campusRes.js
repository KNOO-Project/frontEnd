import { useParams, Routes, Route, useNavigate } from "react-router-dom";
import Cafe from "./cafe";

function CampusRes() {

    let params = useParams();
    //console.log(params);
    let navigate = useNavigate();

    function test(value) {
        console.log(value);
    }

    return(
        <>
        <div onClick={e => {
        }}>campus Res</div>
        
        
        </>
    )
}

export default CampusRes;
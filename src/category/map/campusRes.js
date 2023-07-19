import { useParams, Routes, Route, useNavigate } from "react-router-dom";
import Cafe from "./cafe";

function CampusRes() {

    let params = useParams();
    //console.log(params);
    let navigate = useNavigate();

    return(
        <>
        <div onClick={e => {
        }}>campus Res</div>
        
        <Routes>
            <Route path="cafe" element={<Cafe />} />
        </Routes>
        </>
    )
}

export default CampusRes;
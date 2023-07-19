import { useParams } from "react-router-dom";

function Cafe() {

    let params = useParams();
    let campus = params['*'].split('/')[0];
    
    return(
        <div>cafe page</div>
    )
}

export default Cafe;
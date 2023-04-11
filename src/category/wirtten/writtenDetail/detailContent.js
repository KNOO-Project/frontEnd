import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function DetailContent(props){
    let {post_id} = useParams();
    /* useEffect(() => {
        axios.put('/api/v1/posts', {})
    }) */
    return(
        <div>
            {post_id}
        </div>
    )
}

export default DetailContent;
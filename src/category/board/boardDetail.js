import { useParams } from "react-router-dom";

function BoardDetail(props) {
    let {post_id} = useParams();
    return(
        <div>{post_id}</div>
    )
}

export default BoardDetail;
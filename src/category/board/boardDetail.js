import { useParams } from "react-router-dom";

function BoardDetail(props) {
    //let {post_id} = useParams();
    let content = localStorage.getItem('content');
    return(
        <div>
            {content}
        </div>
    )
}

export default BoardDetail;
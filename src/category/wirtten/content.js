import { useEffect, useState } from "react"
import axios from "axios"
import { Route, Routes, Link, useParams } from "react-router-dom";
import '../../category-css/written/content.css';
import BoardDetail from "../board/boardDetail";
function Content(props){
    let params = useParams();
    let [contentList, setContentList] = useState([])
    useEffect(() => {
        axios.get('/api/v1/users', {
            headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
            console.log(res.data)
            setContentList(res.data.write_posts)
          })
          .catch(/* console.log('err') */)
    }, [])
    
    return(
        <>
        
        <div className="written_content_list">
        {contentList.map((a,i) => {
            return(
                <a href={`/main_board/free_board/detail/${a.post_id}`}>
                <div className="written_content">
                    <p>{a.post_title}</p>
                </div>
                </a>
            )
        })}
        <button>더보기</button>
        </div>
        
        
        
        
        </>
        
    )
}

export default Content;
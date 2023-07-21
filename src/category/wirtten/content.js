import { useEffect, useState } from "react"
import axios from "axios"
import { Route, Routes, Link, useParams } from "react-router-dom";
import '../../category-css/written/content.css';
import BoardDetail from "../board/boardDetail";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import AllContent from "./writtenDetail/allContent";

function Content(props){

    let [contentList, setContentList] = useState([])
    useEffect(() => {
        axios.get('/api/users', {
            headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
            console.log(res.data)
            setContentList(res.data.write_posts)
          })
          .catch(/* console.log('err') */)
    }, [])
    
    return(
        <div className="written_content_list">
        {contentList.map((a,i) => {
            return(
                <div className="written_box" key={i} >
                    <Link to={`../${a.post_category}_board/detail/${a.post_id}`} key={i}>
                        <div className="written_content" >
                            <p className="title">{a.post_title}</p>
                            <p className="content">{a.post_content}</p>
                            <div className="footer">
                                <div className="date_writer">
                                    <p className="date">{a.post_date}</p>
                                    <p className="writer">{a.writer_name}</p>
                                </div>
                            <div className="scrapPage_icons">
                                <AiOutlineLike className="like_icon" />
                                <p className="like_count">{a.likes_count}</p>
                                <AiOutlineComment className="comment_icon" />
                                <p className="comment_count">{a.comments_count}</p>
                                <AiOutlineStar className="scrap_icon" />
                                <p className="scrap_count">{a.scraps_count}</p>
                            </div>
                            <div style={{clear: 'both'}}></div>
                            </div>
                         </div>   
                    </Link>
                </div>
            )
        })}
        <Link to={'contents'}>더보기</Link>
        </div>
    )
}

export default Content;
import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../category-css/written/comment.css';
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import AllComments from "./writtenDetail/allComments";
import {BiImage} from 'react-icons/bi';


function Comment(props){
    var token = props.token;
    let [commentList, setCommentList] = useState([]);

    const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';
    //let navigate = useNavigate();
    useEffect(() => {
        axios.get(`${PROXY}/api/users`, {
            headers: {Authorization: token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
            console.log(res.data)
            setCommentList(res.data.comment_posts)
          })
          .catch(/* console.log('err') */)
    }, []);

    return(
        <>
        <div className="written_comment_list">
        {commentList.map((data,i) => {
            return(
                <Link to={`/articles/${data.post_id}`} key={i}>
                    <div className="title">{data.post_title}</div>
                    <div className="content">{data.post_content.substring(0, 15)
                                //본문내용 20자만 보여주기
                    }</div>
                    <div className="date">{data.post_date}</div>
                    <div className="name">{data.writer_name}</div>
                    <div style={{clear: 'both'}}></div>
                    <div className="counts">
                        <li><AiOutlineLike style={{color: 'blue'}} />{data.likes_count}</li>
                        <li><AiOutlineComment style={{color: '#0dcaf0'}} />{data.comments_count}</li>
                        <li><AiOutlineStar style={{color: 'chartreuse'}} />{data.scraps_count}</li>
                        <li><BiImage style={{color: '#adb5bd'}} /></li>
                    </div>
                    {data.thumbnail ? <img src={data.thumbnail} alt="" /> : null}
                </Link>
            )
        })}
        <Link className="more_btn" to={'comments'}>더보기</Link>
        </div>

        
        
        </>
    )
}

export default Comment;
import { useEffect, useState } from "react"
import axios from "axios"
import { Route, Routes, Link, useParams } from "react-router-dom";
import '../../category-css/written/content.css';
import BoardDetail from "../board/boardDetail";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import AllContent from "./writtenDetail/allContent";
import {BiImage} from 'react-icons/bi';

function Content(props){

    var token = props.token;
    let [contentList, setContentList] = useState([])
    useEffect(() => {
        axios.get('/api/users', {
            headers: {Authorization: token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
            console.log(res.data)
            setContentList(res.data.write_posts)
          })
          .catch(/* console.log('err') */)
    }, [])
    
    return(
        <div className="written_content_list">
        {contentList.map((data,i) => {
            return(
                <Link to={`../${data.post_category}_board/detail/${data.post_id}`} key={i}>
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
        <Link to={'contents'}>더보기</Link>
        </div>
    )
}

export default Content;
import axios from "axios";
import { useEffect, useState } from "react";
import { Link , Routes, Route, useParams, useNavigate} from "react-router-dom";
import '../../../category-css/written/allContents.css';
import {TbCircleChevronLeft, TbCircleChevronRight} from 'react-icons/tb';
import {AiOutlineLike, AiOutlineComment, AiOutlineStar} from 'react-icons/ai';
import {BiImage} from 'react-icons/bi';

function AllContent(props) {
    var token = props.token;
    let navigate = useNavigate();
    let [commentData, setCommentData] = useState([]);
    let [pageLength, setPageLength] = useState([]);
    let [totalPages, setTotalPages] = useState();
    let params = useParams();
    let pageNum = params['*'];
    console.log(params);

    const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

    //첫 페이지 로드시 pageNum = 1
    if(pageNum === '') {
        pageNum = 1;
    }

    useEffect(() => {
        axios.get(`${PROXY}/api/users/more`, {
            headers: {Authorization: token},
            params: {
                kind: 'write',
                page: pageNum
            }
        })
        .then((res) => {
            console.log(res);
            setCommentData(res.data.posts);
            setTotalPages(res.data.total_pages);
            /* url의 pageNum에 따라 dataLength 변경하는 함수 */
            
            if(pageNum <= 10){
                let dataLength = [];
            for(var i=1; i<=10; i++){
                dataLength.push(i);
                if(i === res.data.total_pages){
                    break;
                }
            }
            setPageLength(dataLength);
            }
            else {
                let rest = pageNum % 10;
                if(rest !== 0){
                    let startNum = pageNum - rest + 1;
                    let dataLength = [];
                    for(var i = startNum; i <= startNum + 9; i++){
                        if(i === res.data.total_pages){
                            //i === total_pages 이면 멈추기
                            dataLength.push(i);
                            break;    
                        }
                        dataLength.push(i);
                    }
                    setPageLength(dataLength);    
                }else {
                    let startNum = pageNum - 9;
                    let dataLength = [];
                    for(var i=startNum; i<=pageNum; i++){
                        dataLength.push(i);
                    }
                    setPageLength(dataLength);
                }
                
            }
        })
        .catch(() => {
            console.log('err');
        })
    }, [pageNum]);

    return(
        <>
        <div className="user_contents">
        {commentData.map((data, i) => {
            return(
                <Link to={`/articles/${data.post_id}`}>
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
        </div>
        {/* page number */}
        <div className="allContents_pageNum">
                    
                {pageLength.length === 1  ? null : 
                <>
                {pageLength.includes(1) || totalPages === 0 ? null : 
                    <TbCircleChevronLeft className="left_icon" onClick={e => {
                        let len = [];
                        for(var i=pageLength[0]-10; i<pageLength[0]; i++){
                            len.push(i);
                        }
                        console.log('len', len);
                        setPageLength(len);
                        navigate(`../contents/${pageLength[0] - 10}`);
                    }} />
                    }
                    {pageLength.map((a, i) => {
                            return(
                                <Link to={`../contents/${a}`} key={i} style={a === Number(pageNum) ? {color: '#0d6efd'} : {color: 'black'}} >
                                <li  onClick={e => {
                                    //해당 pageNum을 get요청으로 서버에 전송
                                }} >{a}</li>
                                </Link>
                            )
                    })}
                    {pageLength.includes(totalPages) || totalPages === 0 ? null : 
                    <TbCircleChevronRight className="right_icon" onClick={e => {
                        let len = [];
                        for(var i=pageLength[0]+10; i<=pageLength[9]+10; i++){
                            if(i === totalPages){
                                len.push(i);
                                break;
                            }else {
                                len.push(i);
                            }
                        }
                        console.log('len', len);
                        setPageLength(len);
                        navigate(`../contents/${pageLength[0] + 10}`);
                    }} />
                }
                </>
                }
                    
            </div>

                <Routes>
                    <Route path="../contents/:pageNum" element={<AllContent token={token} />} />
                </Routes>
        </>
        

    )
}

export default AllContent
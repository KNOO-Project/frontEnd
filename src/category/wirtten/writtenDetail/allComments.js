import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Routes, Route, useParams, useNavigate } from "react-router-dom";
import '../../../category-css/written/allComments.css';
import {TbCircleChevronLeft, TbCircleChevronRight} from 'react-icons/tb';

function AllComments(props) {
    var token = props.token;
    let navigate = useNavigate();
    let [commentData, setCommentData] = useState([]);
    let [totalPages, setTotalPages] = useState();
    let [pageLength, setPageLength] = useState([]);
    let params = useParams();
    let pageNum = params['*'];
    console.log(pageNum);
    //첫 페이지 로드시 pageNum = 1
    if(pageNum === ''){
        pageNum = 1;
    }

    useEffect(() => {
        axios.get('/api/users/more', {
            headers: {Authorization: token},
            params: {
                kind: 'comment',
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


    console.log('pageLength',pageLength);

    return(
        <>
        <div className="user_comments">
        {commentData.map((a, i) => {
            return(
                <Link to={`/${a.post_category}_board/detail/${a.post_id}`}>
                    <div className="title">{a.post_title}</div>
                    <div className="content">{a.post_content.substring(0, 20)
                    //본문내용 20자만 보여주기
                    }</div>
                    <div className="name">{a.writer_name}</div>
                    <div className="date">{a.post_date}</div>
                </Link>
            )
        })}
        </div>
        {/* page number */}
        <div className="allComments_pageNum">
                    
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
                        navigate(`../comments/${pageLength[0] - 10}`);
                    }} />
                    }
                    {pageLength.map((a, i) => {
                            return(
                                <Link to={`../comments/${a}`} key={i} style={a === Number(pageNum) ? {color: '#0d6efd'} : {color: 'black'}} >
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
                        navigate(`../comments/${pageLength[0] + 10}`);
                    }} />
                }
                </>
                }
                    
                </div>
            
            
        </>
        

    )
}

export default AllComments;
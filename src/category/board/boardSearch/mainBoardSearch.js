import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {TbCircleChevronLeft, TbCircleChevronRight} from 'react-icons/tb';
import {AiOutlineSearch, AiOutlineLike, AiOutlineStar, AiOutlineComment} from 'react-icons/ai';
import '../../../category-css/search.css';

function MainBoardSearch(props) {

    var token = props.token;
    let params = useParams();
    console.log(params);
    let navigate = useNavigate();
    let keyword = params.searchContent_page.split('&')[0].split('=')[1];
    let pageNum = params.searchContent_page.split('&')[1].split('=')[1];
    let [searchData, setSearchData] = useState([]);
    let [totalPages, setTotalPages] = useState();
    let [pageLength, setPageLength] = useState([]);

    console.log(pageNum, keyword);

    useEffect(() => {
        axios.get('/api/posts/search', {
            headers: {Authorization: token},
            params: {
                condition: props.searchTypeSelected,
                keyword: keyword,
                page: pageNum
            }
        })
        .then((res) => {
            setSearchData(res.data.posts);
            setTotalPages(res.data.total_pages);
            console.log(res);
            /* url의 pageNum에 따라 dataLength 변경하는 함수 */
            if(res.data.total_pages === 0){
                pageLength([]);
            }else if(pageNum <= 10){
                let dataLength = [];
            for(var i=1; i<=10; i++){
                dataLength.push(i);
                if(i === res.data.total_pages){
                    break;
                }
            }
            setPageLength(dataLength);
            }else {
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
            //setSearchData(res.data);
        })
        .catch(() => {
            console.log('err');
        })
    }, [pageNum, keyword]);
    
    //console.log(searchData);
    //console.log(totalPages);
    //console.log('pageLength',pageLength);
    return(
        <>
        <div className="search_list">
                {searchData.map((data, i) => {
                        return(
                            <Link to={`../detail/${data.post_id}`} >
                                <div className="title">{data.post_title}</div>
                                <div className="content">{data.post_content.substring(0, 20)
                                //본문내용 20자만 보여주기
                                }</div>
                                <div className="date">{data.post_date}</div>
                                <div className="name">{data.writer_name}</div>
                                <div style={{clear: 'both'}}></div>
                                <div className="counts">
                                    <li><AiOutlineLike />{data.likes_count}</li>
                                    <li><AiOutlineComment />{data.comments_count}</li>
                                    <li><AiOutlineStar />{data.scraps_count}</li>
                                </div>
                                {data.thumbnail ? <img src={data.thumbnail} alt="" /> : null}
                            </Link>
                        )
                })}
        </div>
        {/* page number */}
        <div className="search_pageNum">
                {totalPages === 0 ?
                <>
                <h2>검색한 게시글이 존재하지 않습니다.</h2>
                </>
                : null}    
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
                        navigate(`../search/keyword=${keyword}&page=${pageLength[0] - 10}`);
                    }} />
                    }
                    {pageLength.map((a, i) => {
                            return(
                                <Link to={`../search/keyword=${keyword}&page=${a}`} key={i} style={a === Number(pageNum) ? {color: '#0d6efd'} : {color: 'black'}} >
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
                        navigate(`../search/keyword=${keyword}&page=${pageLength[0] + 10}`);
                    }} />
                }
                </>
                }
                    
                </div>        
        </>

    )
}

export default MainBoardSearch;
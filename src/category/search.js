import { useEffect, useState } from 'react';
import '../category-css/search.css';
import BoardDetail from './board/boardDetail';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {TbCircleChevronRight, TbCircleChevronLeft} from 'react-icons/tb';

function Search(props) {
    let navigate = useNavigate();
    let token = props.cookies.token;
    let params = useParams();
    let category = props.category;
    let condition = props.searchTypeSelected;
    console.log(params);
    let keyword = params.searchContent_page.split('&')[0].split('=')[1];
    let pageNum = params.searchContent_page.split('&')[1].split('=')[1]

    console.log(keyword, pageNum);
    //let postData = props.searchData.posts;
    //let totalPage = props.searchData.total_pages;
    let [postData, setPostData] = useState([]);
    let [totalPages, setTotalPages] = useState();
    let [pageLength, setPageLength] = useState([]);
    //let [page, setPage] = useState();

    useEffect(() => {
        axios.get('/api/v1/posts/search', {
            headers: {Authorization: token},
            params: {
                'category': category,
                'condition': condition,
                'keyword': keyword,
                page: pageNum
            }
        })
        .then((res) => {
            console.log(res);
            setPostData(res.data.posts);
            setTotalPages(res.data.total_pages);
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
    }, [pageNum])

    console.log('Data', postData);
    console.log('pageLength', pageLength);
    console.log('pageNum', pageNum);
    console.log('totalPages', totalPages);
    //console.log('page', page);

    return(
        <>
            <div className="search_list">
                {postData.map((a, i) => {
                        return(
                            <>
                            <Link to={`../detail/${a.post_id}`} >
                                <div className="title">{a.post_title}</div>
                                <div className="content">{a.post_content.substring(0, 20)
                                //본문내용 20자만 보여주기
                                }</div>
                                <div className="name">{a.writer_name}</div>
                                <div className="date">{a.post_date}</div>
                            </Link>
                            </>    
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
            <Routes>
                <Route path={`../search/:searchContent_page/*`} element={<Search category={category} searchTypeSelected={condition} 
                     cookies={props.cookies}   />} />
                <Route path='../detail/:postId/*' element={<BoardDetail  cookies={props.cookies} />} />
            </Routes>
        </>
        
        
    )
}

export default Search;
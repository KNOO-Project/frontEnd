import { useEffect, useState } from 'react';
import '../../../category-css/search.css';
import BoardDetail from '../boardDetail';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {TbCircleChevronRight, TbCircleChevronLeft} from 'react-icons/tb';
import {AiOutlineSearch, AiOutlineLike, AiOutlineStar, AiOutlineComment} from 'react-icons/ai';
import {BiImage} from 'react-icons/bi';

function Search(props) {
    let navigate = useNavigate();
    let token = props.token;
    let params = useParams();
    let category = props.category;
    let condition = props.searchTypeSelected;
    let keyword = params.searchContent_page.split('&')[0].split('=')[1];
    let pageNum = params.searchContent_page.split('&')[1].split('=')[1];

    let [postData, setPostData] = useState([]);
    let [totalPages, setTotalPages] = useState();
    let [pageLength, setPageLength] = useState([]);
    let [diffTimeValue, setDiffTimeValue] = useState([]);

    useEffect(() => {
        axios.get('/api/posts/search', {
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
                //검색결과가 없는 경우
                pageLength([]);
            }else if(pageNum <= 10){
                //totalPage가 10 이하인 경우
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

            let currentDate = new Date();
            //console.log(currentDate)
            let currentDateValue = [
                {min: currentDate.getMinutes()},
                {hour: currentDate.getHours()},
                {day: currentDate.getDate()},
                {month: currentDate.getMonth() + 1},
                {year: currentDate.getFullYear()}
            ]
            //console.log(currentDateValue)
            //console.log(typeof(currentDate.getMinutes()))
            let diffTime = [];
            for(var i=0; i<res.data.posts.length; i++){
                let writeDate = res.data.posts[i].post_date;
                let splitDate = writeDate.split(' ');
                let dateValue = [
                    {min: Number(splitDate[1].split(':')[1])},
                    {hour: Number(splitDate[1].split(':')[0])},
                    {day: Number(splitDate[0].split('/')[2])},
                    {month: Number(splitDate[0].split('/')[1])},
                    {year: Number(splitDate[0].split('/')[0])} 
                ]


                if(currentDateValue[4]['year'] - dateValue[4]['year'] !== 0){
                    diffTime.push(Number(currentDateValue[4]['year'] - dateValue[4]['year']) + '년전');
                }else if(currentDateValue[3]['month'] - dateValue[3]['month'] !== 0){
                    diffTime.push(Number(currentDateValue[3]['month'] - dateValue[3]['month']) + '달전');
                }else if(currentDateValue[2]['day'] - dateValue[2]['day'] !== 0){
                    diffTime.push(Number(currentDateValue[2]['day'] - dateValue[2]['day']) + '일전');
                }else if(currentDateValue[1]['hour'] - dateValue[1]['hour'] !== 0){
                    if(currentDateValue[0]['min'] - dateValue[0]['min'] === 1 && (currentDateValue[0]['min'] < dateValue[0]['min'])){
                        diffTime.push(Number(currentDateValue[0]['min'] + 60 - dateValue[0]['min']) + '분전');    
                    }else{
                        diffTime.push(Number(currentDateValue[1]['hour'] - dateValue[1]['hour']) + '시간전');
                    }
                }else if(currentDateValue[0]['min'] - dateValue[0]['min'] !== 0){
                    diffTime.push(Number(currentDateValue[0]['min'] - dateValue[0]['min']) + '분전');
                }

            }

            setDiffTimeValue(diffTime);
             
        })
        .catch(() => {
            console.log('err');
        })
    }, [pageNum, keyword])

    //console.log('Data', postData);
    //console.log('pageLength', pageLength);
    //console.log('pageNum', pageNum);
    //console.log('totalPages', totalPages);
    //console.log('page', page);

    return(
        <>
            <div className="search_list">
                {postData.map((data, i) => {
                        return(
                            <>
                            <Link to={`../detail/${data.post_id}`} >
                                <div className="title">{data.post_title}</div>
                                <div className="content">{data.post_content.substring(0, 20)
                                //본문내용 20자만 보여주기
                                }</div>
                                <div className="date">{diffTimeValue[i]}</div>
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
                     token={token}   />} />
                <Route path='../detail/:postId/*' element={<BoardDetail  token={token} />} />
            </Routes>
        </>
        
        
    )
}

export default Search;
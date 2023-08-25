import BoardForm from "./boardForm";
import CategorySearch from "./boardSearch/search";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import axios from "axios";
import {TbCircleChevronLeft, TbCircleChevronRight} from 'react-icons/tb';
import {AiOutlineLike, AiOutlineStar, AiOutlineComment} from 'react-icons/ai';
import {BiImage} from 'react-icons/bi';

function CategoryBoardPagenation(props){
    var token = props.token;
    let navigate = useNavigate();
    let params = useParams();
    console.log('params', params['*']);
    let category = params.category_board.split('_')[0];
    //let categoryTitle = localStorage.getItem('pathBoardTitle');
    let category_path = localStorage.getItem('pathBoardTitle');
    let [boardTitle, setBoardTitle] = useState();
    let [boardData, setBoardData] = useState([]);
    let [pageLength, setPageLength] = useState([]);
    let [totalPages,setTotalPages] = useState();
    let [pageClick, setPageClick] = useState(Number(params['pageNum'] <= 10 ? 0 : 1));  //Number(params['pageNum'] <= 10 이면 pageLength를 1~10까지 유지
    let [searchContent, setSearchContent] = useState(null);
    let [searchTypeSelected, setSearchTypeSelected] = useState('all');
    let [diffTimeValue, setDiffTimeValue] = useState([]);
    
    useEffect(() => {
        if(category.includes('free')){
            setBoardTitle('자유')
        } else if(category.includes('graduate')){
            setBoardTitle('졸업생')
        } else if(category.includes('newcomer')){
            setBoardTitle('새내기')
        } else if(category.includes('info')){
            setBoardTitle('정보')
        } else if(category.includes('employment')){
            setBoardTitle('취업/진로')
        } else if(category.includes('student')){
            setBoardTitle('동아리/학회')
        }
        //console.log('pageNum',pageNum)
        axios.get(`/api/posts/${category}`, {
            headers: {Authorization : props.token},
            params: {
                page: params['pageNum']
            }
          })
          .then((res)=>{
            //console.log('boardTitle', boardTitle)
            //console.log(res)
            console.log(res.data.total_pages)
            setTotalPages(res.data.total_pages)
            console.log(res.data)
            setBoardData(res.data.posts);
            let dataLength = [];
            for(var i=((pageClick*10)+1); i<=((pageClick+1)*10); i++){
                dataLength.push(i);
                if(i === res.data.total_pages){
                    break;
                }
            }
            setPageLength(dataLength);
            
            let currentDate = new Date();
            //console.log(currentDate)
            let currentDateValue = [
                {min: currentDate.getMinutes()},
                {hour: currentDate.getHours()},
                {day: currentDate.getDate()},
                {month: currentDate.getMonth() + 1},
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
                ]

                if(currentDateValue[3]['month'] - dateValue[3]['month'] !== 0){
                    diffTime.push(Number(currentDateValue[3]['month'] - dateValue[3]['month']) + '달전');
                }else if(currentDateValue[2]['day'] - dateValue[2]['day'] !== 0){
                    if(currentDateValue[2]['day'] - dateValue[2]['day'] < 7){
                        diffTime.push(Number(currentDateValue[2]['day'] - dateValue[2]['day']) + '일전');
                    }else {
                        let week = parseInt(Number(currentDateValue[2]['day'] - dateValue[2]['day']) / 7);
                        diffTime.push(week + '주전');
                    }
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
          .catch((res) => {
            console.log(res)
          })
          return(
            () => {
                setBoardData([]);
                setPageLength([]);     //boardData를 보여준 후 pageNum을 보여줌
                console.log('preBoardTitle', boardTitle)
            }
            )
    }, [ category, pageClick, params['pageNum']]                       // currentUrl 값이 바뀔때마다(각 카테고리 게시판 클릭) useEffect 함수 실행
    );
    /* function getNewpage(pageLength, pageClick){
        let newPage = [];
        for(var i=pageClick * 10; i<(pageClick+1)*10; i++){
            newPage.push(pageLength[i]);
        }
        return newPage;
    }
    setPageNation(getNewpage(pageLength, pageClick)); */
    console.log(pageClick)
    console.log('totalPages', totalPages)
    console.log(pageLength)
    return(
        <>
        {params['*'] === ''  ? <>
            <div className="category_board">
            {/* <div className="head">
                <button className="writing_btn" onClick={() => {
                        localStorage.removeItem('categoryBoardClick');
                    }} ><Link to='writing' ><HiPencil className="write_icon" /><span>작성하기</span></Link></button>
                    <h2>{boardTitle} 게시판</h2>
                    <form className="search">
                        <select className="search_select" onChange={e => {
                            setSearchTypeSelected(e.target.value)
                        }} value={searchTypeSelected}>
                            <option value='all' >제목+본문</option>
                            <option value='title' >제목</option>
                            <option value='content' >본문</option>
                        </select>
                        <input type="text" value={searchContent} onChange={e => {
                            setSearchContent(e.target.value)
                        }} />
                        <AiOutlineSearch className="search_icon" onClick={() => {
                            navigate(`../search/keyword=${searchContent}&page=1`);
                            //search();
                            //console.log(searchTypeSelected);
                            //console.log(searchContent);
                        }} />
                    </form>
                </div> */}
                <div className="board_list">
                    {boardData.map((data, i) => {
                        while(i < 20){
                            return(
                                <Link to={`../detail/${data.post_id}`} key={i}>   
                                    <div className="title">{data.post_title}</div>
                                    <div className="content">{data.post_content.substring(0, 20)}</div> {/* 본문내용 20자만 보여주기 */}
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
                            )
                        }
                    })}
                </div>
                {/* page number */}
                <div className="categoryBoard_pageNum">
                    {pageLength.includes(1)  ? null : 
                        <TbCircleChevronLeft className="left_icon" onClick={e => {
                            setPageClick(prev => prev -= 1);            //pageClick - 1해서 밑에 보여지는 pageNum 변경
                            //console.log('leftClick', pageClick);
                            navigate(`../page/${pageLength[0] - 10}`);
                        }} />
                    }
                    {pageLength.map((a, i) => {
                            return(
                                <Link to={`../page/${a}`} key={i} style={a === Number(params['pageNum']) /* type 맞춰주기 */ ? {color: '#0d6efd'} : null}>
                                <li  onClick={e => {
                                    //window.location.href = `${category_path}_board/page=${a}`
                                    //해당 pageNum을 get요청으로 서버에 전송
                                }} >{a}</li>
                                </Link>
                            )
                    })}
                    {pageLength.includes(totalPages) ? null : 
                    <TbCircleChevronRight className="right_icon" onClick={e => {
                        setPageClick(prev => prev += 1);                ////pageClick + 1해서 밑에 보여지는 pageNum 변경
                        //console.log('rightClick', pageClick);
                        navigate(`../page/${pageLength[0] + 10}`);
                    }} />
                }
                </div>
            </div>
                {/* 글쓰기 버튼 누르면 null에 해당하는 값을 보여주면서 위의 값이 감춰지고 글쓰기 페이지에 해당하는 UI 보여주기 */}
        </> : null}
        
                <Routes>
                    <Route path={`../search/:searchContent_page/*`} element={<CategorySearch category={category} searchTypeSelected={searchTypeSelected} 
                     token={token}   />} />
                    <Route path="writing" element={<BoardForm token={token}  />} />
                    <Route path='detail/:postId/*' element={<BoardDetail token={token} />} />
                </Routes>
        </>
        
        
            
                
        
        
    )
}

export default CategoryBoardPagenation;
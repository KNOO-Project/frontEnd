import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import CategoryBoardPagenation from "./categoryBoardPagenation";
import Search from "./boardSearch/search";
import axios from "axios";
import {TbCircleChevronRight, TbCircleChevronLeft} from 'react-icons/tb';
import {AiOutlineSearch, AiOutlineLike, AiOutlineStar, AiOutlineComment} from 'react-icons/ai';
import {HiPencil} from 'react-icons/hi';
import {BiImage} from 'react-icons/bi';

function CategoryBoard(props){
    let navigate = useNavigate();
    let params = useParams();
    let token = props.token;
    console.log('params', params['*']);
    let category = params.category_board.split('_')[0];
    const currentUrl = window.location.href;
    //console.log(currentUrl);
    
    let category_path = localStorage.getItem('pathBoardTitle');
    let [boardTitle, setBoardTitle] = useState();
    let [boardData, setBoardData] = useState([]);
    let [pageLength, setPageLength] = useState([]);
    let [pageNum, setPageNum] = useState();          
    let [totalPages,setTotalPages] = useState();
    let [pageClick, setPageClick] = useState(0);  
    let [searchContent, setSearchContent] = useState(null);
    let [searchTypeSelected, setSearchTypeSelected] = useState('all');
    let [diffTimeValue, setDiffTimeValue] = useState([]);
    
    
    const search = () => {
        axios.get('/api/posts/search', {
            headers: {Authorization: token},
            params: {
                'category': category,
                condition: searchTypeSelected,
                keyword: searchContent,
                page: 1
            }
        })
        .then(() => {
            navigate(`search/keyword=${searchContent}&page=1`);
        })
        .catch((res) => {
            alert(res.response.data.message);
        })
    }

    const enterKey = (e) => {
        if(e.key === 'Enter'){
            search();
            e.preventDefault();
        }
    }

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
            headers: {Authorization : token},
            params: {
                page: 1                                     // 페이지 첫 로드시 pageNum은 1
            }
          })
          .then((res)=>{
            //console.log('boardTitle', boardTitle)
            console.log(res)
            setTotalPages(res.data.total_pages);
            setBoardData(res.data.posts);
            let dataLength = [];
            for(var i=1; i<=10; i++){
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
            console.log('error');
          })
          return(
            () => {
                setBoardData([]);
                setPageLength([]);     //boardData를 보여준 후 pageNum을 보여줌
                setSearchContent('');
            }
            )
    }, [ pageNum, category, currentUrl ]                                          // currentUrl 값이 바뀔때마다(각 카테고리 게시판 클릭) useEffect 함수 실행
    );

    return(
        <>
            <div className="category_board">
                <div className="head">
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
                        <input type="text" value={searchContent} onKeyDown={enterKey} onChange={e => {
                            setSearchContent(e.target.value)
                        }} />
                        <AiOutlineSearch className="search_icon" onClick={() => {
                            search();
                        }} />
                    </form>
                </div>
                {params['*'] === '' ?  
                <>
                <div className="board_list">
                    {boardData.map((data, i) => {
                        while(i < 20){
                            return(
                                <Link to={`detail/${data.post_id}`} key={i}>   
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
                                        <li><BiImage style={{color: '#adb5bd'}} />{data.images_count}</li>
                                    </div>
                                    {data.thumbnail ? <img src={data.thumbnail} alt="" /> : null}
                                </Link>    
                                
                            )
                        }
                    })}
                </div>
                {/* page number */}
                <div className="categoryBoard_pageNum">
                
                    {pageLength.map((a, i) => {
                            return(
                                <Link to={`page/${a}`} key={i} style={a === 1 ? {color: '#0d6efd'} : null}>
                                <li  onClick={e => {
                                    setPageNum(a);
                                    //해당 pageNum을 get요청으로 서버에 전송
                                }} >{a}</li>
                                </Link>
                            )
                    })}
                    {pageLength.includes(totalPages) ? null : 
                    <TbCircleChevronRight className="right_icon" onClick={e => {
                        setPageClick(prev => prev += 1);                ////pageClick + 1해서 밑에 보여지는 pageNum 변경
                        navigate(`page/${pageLength[0] + 10}`)
                    }} />
                }
                </div>
                </>
            : null}
                
            </div>
                {/* 글쓰기 버튼 누르면 null에 해당하는 값을 보여주면서 위의 값이 감춰지고 글쓰기 페이지에 해당하는 UI 보여주기 */}
        
                <Routes>
                    <Route path={`search/:searchContent_page/*`} element={<Search category={category} searchTypeSelected={searchTypeSelected} 
                     token={token} />} />
                    <Route path="page/:pageNum/*" element={<CategoryBoardPagenation token={token} pageNum={pageNum} />} />
                    <Route path="writing" element={<BoardForm token={token} category={category} />} />
                    <Route path='detail/:postId/*' element={<BoardDetail  token={token} />} />
                </Routes>
        </>
        
        
            
                
        
        
    )
}

export default CategoryBoard;
import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import CategoryBoardPagenation from "./categoryBoardPagenation";
import Search from "./boardSearch/search";
import axios from "axios";
import {TbCircleChevronRight, TbCircleChevronLeft} from 'react-icons/tb';
import {AiOutlineSearch} from 'react-icons/ai';
import {HiPencil} from 'react-icons/hi';

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
            
          })
          .catch((res) => {
            console.log(res)
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

    //검색 기능
    /* const search = () => {
        axios.get('/api/posts/search', {
            headers: {Authorization: token},
            params: {
                'category': category,
                condition: searchTypeSelected,
                keyword: searchContent,
                page: 1
            }
        })
        .then((res) => {
            console.log(res);
            //setSearchData(res.data);
            navigate(`search/keyword=${searchContent}/page=1`);
        })
        .catch(() => {
            console.log('err');
        })
    } */
    //console.log(pageNum)
    //console.log(searchTypeSelected);
    //console.log('searchContent', searchContent);
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
                    {boardData.map((a, i) => {
                        while(i < 20){
                            return(
                                <Link to={`detail/${a.post_id}`} key={i}>   
                                    <div className="title">{a.post_title}</div>
                                    <div className="content">{a.post_content.substring(0, 20)
                                    //본문내용 20자만 보여주기
                                    }</div>
                                    <div className="date">{a.post_date}</div>
                                    <div className="name">{a.writer_name}</div>
                                    <hr></hr>
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
import BoardForm from "./boardForm";
import Search from "../search";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import axios from "axios";
import {TbCircleChevronLeft, TbCircleChevronRight} from 'react-icons/tb';
import {AiOutlineSearch} from 'react-icons/ai';

function CategoryBoardPagenation(props){
    let navigate = useNavigate();
    let params = useParams();
    console.log(params);
    console.log(params['pageNum'])
    //const currentUrl = window.location.href;
    //console.log(currentUrl);
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
        axios.get(`/api/v1/posts/${category}`, {
            headers: {Authorization : props.cookies.token},
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
            /* if(res.data.total_pages % 20 === 0){
                let num = res.data.total_pages / 20;
                for(var i=1; i<=num; i++){
                    dataLength.push(i);
                }
                setPageLength(dataLength);
            }else{
                let num = Math.floor(res.data.total_pages / 20) + 1;
                for(var j=1; j<=num; j++){
                    dataLength.push(j);
                }
                setPageLength(dataLength);
            } */
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
    }, [ category, props.cookies.token, pageClick, params['pageNum']]                       // currentUrl 값이 바뀔때마다(각 카테고리 게시판 클릭) useEffect 함수 실행
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
            <div className="head">
                <button className="writing_btn" onClick={() => {
                        localStorage.removeItem('categoryBoardClick');
                    }} ><Link to='writing' >글쓰기</Link></button>
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
                </div>
                <div className="board_list">
                    {boardData.map((a, i) => {
                        while(i < 20){
                            return(
                                <Link to={`../detail/${a.post_id}`} key={i}>   
                                    <div className="title">{a.post_title}</div>
                                    <div className="content">{a.post_content.substring(0, 20)
                                    //본문내용 20자만 보여주기
                                    }</div><div className="name">{a.writer_name}</div><div className="date">{a.post_date}</div>
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
                    <Route path={`../search/:searchContent_page/*`} element={<Search category={category} searchTypeSelected={searchTypeSelected} 
                     cookies={props.cookies}   />} />
                    <Route path="writing" element={<BoardForm cookies={props.cookies}  />} />
                    <Route path='detail/:postId/*' element={<BoardDetail cookies={props.cookies} />} />
                </Routes>
        </>
        
        
            
                
        
        
    )
}

export default CategoryBoardPagenation;
import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import CategoryBoardPagenation from "./categoryBoardPagenation";
import axios from "axios";
import {TbCircleChevronRight, TbCircleChevronLeft} from 'react-icons/tb'

function CategoryBoard(props){
    let navigate = useNavigate();
    let params = useParams();
    //console.log(params)
    const currentUrl = window.location.href;
    //console.log(currentUrl);
    let category = currentUrl.split('/')[3];
    //let categoryTitle = localStorage.getItem('pathBoardTitle');
    let category_path = localStorage.getItem('pathBoardTitle');
    let [boardTitle, setBoardTitle] = useState();
    let [preBoardTitle, setPreBoardTitle] = useState();
    let [boardData, setBoardData] = useState([]);
    let [pageLength, setPageLength] = useState([]);
    let [pageNum, setPageNum] = useState();          
    let [totalPages,setTotalPages] = useState();
    let [pageClick, setPageClick] = useState(0);  
    
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
        axios.get(`/api/v1/posts/${category_path}`, {
            headers: {Authorization : props.cookies.token},
            params: {
                page: 1                                     // 페이지 첫 로드시 pageNum은 1
            }
          })
          .then((res)=>{
            //console.log('boardTitle', boardTitle)
            //console.log(res)
            setTotalPages(res.data.total_pages)
            setBoardData(res.data.posts);
            let dataLength = [];
            for(var i=1; i<=10; i++){
                dataLength.push(i);
                if(i === res.data.total_pages){
                    break;
                }
            }
            setPageLength(dataLength)
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
                //console.log('preBoardTitle', boardTitle)
            }
            )
    }, [currentUrl, pageNum, category, category_path, props.cookies.token]                                          // currentUrl 값이 바뀔때마다(각 카테고리 게시판 클릭) useEffect 함수 실행
    );
    //console.log(pageNum)
    return(
        <>
        {params['*'] === ''  ? <>
            <div className="category_board">
                <div className="head">
                    <h2>{boardTitle} 게시판</h2>
                    <button onClick={() => {
                        localStorage.removeItem('categoryBoardClick');
                    }} ><Link to='writing' >글쓰기</Link></button>
                </div>
                <div className="board_list">
                    {boardData.map((a, i) => {
                        while(i < 20){
                            return(
                                <Link to={`detail/${a.post_id}`} key={i}>
                                <li  onClick={() => {
                                    localStorage.removeItem('categoryBoardClick');
                                    localStorage.setItem('content', a.post_content);
                                }} ><div className="title">{a.post_title}</div>
                                <div className="content">{a.post_content.substring(0, 20)
                                //본문내용 20자만 보여주기
                                }</div><div className="name">{a.writer_name}</div><div className="date">{a.post_date}</div>
                                </li>
                                </Link>
                            )
                        }
                    })}
                </div>
                {/* page number */}
                <div className="pageNum">
                
                    {pageLength.map((a, i) => {
                            return(
                                <Link to={`page/${a}`} key={i} style={a === 1 ? {color: '#0d6efd'} : null}>
                                <li  onClick={e => {
                                    setPageNum(a);
                                    //window.location.href = `${category_path}_board/page=${a}`
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
            </div>
                {/* 글쓰기 버튼 누르면 null에 해당하는 값을 보여주면서 위의 값이 감춰지고 글쓰기 페이지에 해당하는 UI 보여주기 */}
        </> : null}
        
                <Routes>
                    <Route path="page/:pageNum/*" element={<CategoryBoardPagenation cookies={props.cookies} pageNum={pageNum} />} />
                    <Route path="writing" element={<BoardForm cookies={props.cookies}  />} />
                    <Route path='detail/:post_id/*' element={<BoardDetail category_path={category_path} cookies={props.cookies} />} />
                </Routes>
        </>
        
        
            
                
        
        
    )
}

export default CategoryBoard;
import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import axios from "axios";

function CategoryBoard(props) {
    let params = useParams();
    const currentUrl = window.location.href;
    let category = currentUrl.split('/')[3];
    let categoryTitle = localStorage.getItem('pathBoardTitle');
    let category_path = localStorage.getItem('pathBoardTitle');
    let [boardTitle, setBoardTitle] = useState();
    let [boardData, setBoardData] = useState([]);
    
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
        axios.get(`/api/v1/posts/${category_path}`, {
            headers: {Authorization : props.cookies.token}
          })
          .then((res)=>{
            setBoardData(res.data)
          })
          .catch((res) => {
            console.log(res)
          })
          return(
            () => {setBoardData([])}
            )
    }, [currentUrl]                                          // currentUrl 값이 바뀔때마다(각 카테고리 게시판 클릭) useEffect 함수 실행
    );

    return(
        <>
        {params['*'] === '' ? <>
            <div className="category_board">
            <div className="head">
                <h2>{boardTitle} 게시판</h2>
                <button onClick={() => {
                    localStorage.removeItem('categoryBoardClick');
                }} ><Link to='writing' >글쓰기</Link></button>
            </div>
            <div className="board_list">
                
                    {boardData.map((a, i) => {
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
                        
                    })}
                
            </div>
            </div>
                {/* 글쓰기 버튼 누르면 null에 해당하는 값을 보여주면서 위의 값이 감춰지고 글쓰기 페이지에 해당하는 UI 보여주기 */}
        </> : null}
                <Routes>
                    <Route path="writing" element={<BoardForm cookies={props.cookies}  />} />
                    <Route path='detail/:post_id/*' element={<BoardDetail category_path={category_path} cookies={props.cookies} />} />
                </Routes>
        </>
        
        
            
                
        
        
    )
}

export default CategoryBoard;
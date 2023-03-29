import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useState} from 'react';
import BoardDetail from "./boardDetail";

function CategoryBoard(props) {
    //console.log(localStorage.getItem('pathBoardTitle'))
    let categoryTitle = localStorage.getItem('pathBoardTitle');
    let data = JSON.parse(localStorage.getItem(`${categoryTitle}_data`))

    return(
        <>
        {localStorage.getItem('categoryBoardClick') ? <>
            <div className="category_board">
            <div className="head">
                <h2>{localStorage.getItem('boardTitle')} 게시판</h2>
                <button onClick={() => {
                    localStorage.removeItem('categoryBoardClick');
                }} ><Link to='writing' >글쓰기</Link></button>
            </div>
            <div className="board_list">
                {data.map((a, i) => {
                    return(
                        <li key={i}><div className="title" onClick={() => {
                            localStorage.removeItem('categoryBoardClick');
                        }}><Link to={`detail/${a.post_id}`}>{a.post_title}</Link></div><div className="name">{a.writer_name}</div><div className="date">{a.post_date}</div></li>
                        
                    )
                })}
            </div>
            </div>
                {/* 글쓰기 버튼 누르면 null에 해당하는 값을 보여주면서 위의 값이 감춰지고 글쓰기 페이지에 해당하는 UI 보여주기 */}
        </> : null}
                <Routes>
                    <Route path="writing" element={<BoardForm cookies={props.cookies}  />} />
                    <Route path='detail/:id' element={<BoardDetail />} />
                </Routes>
        {/* {localStorage.getItem('boardForm_click') || localStorage.getItem('boardDetail') ? <>
                <Routes>
                    <Route path="writing" element={<BoardForm cookies={props.cookies} title={props.title} category_title={props.category_title} />} />
                    <Route path='detail:id' element={<BoardDetail />} />
                </Routes>
            </> : <>
                    <div className="head">
                    <h2>{props.title} 게시판</h2>
                        <button onClick={() => {
                            localStorage.setItem('boardForm_click', true)
                        }} ><Link to='writing' >글쓰기</Link></button>
                    </div>
                    <div className="board-list">
                        {data.map((a, i) => {
                            return (
                                <li key={i}><div className="title" onClick={(e) => {
                                    localStorage.setItem('boardDetail', true)
                                }}
                                ><Link to={`detail/${a.post_id}`}>{a.post_title}</Link></div><div>{a.writer_name}</div><div>{a.post_date}</div></li>
                            )
                        })}
                    </div>
            </>} */}
        </>
        
        
            
                
        
        
    )
}

export default CategoryBoard;
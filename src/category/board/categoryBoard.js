import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

function CategoryBoard(props) {
    //let navigate = useNavigate();
    return(
        <div className="category_board">
            {localStorage.getItem('categoryBoard_click') ? <>
                <Routes>
                    <Route path="writing" element={<BoardForm cookies={props.cookies} title={props.title} category_title={props.category_title} />} />
                </Routes>
            </> : <>
                <div >
                    <h2>{props.title} 게시판</h2>
                    <button onClick={() => {
                        localStorage.setItem('categoryBoard_click', true)
                    }} ><Link to='writing' >글쓰기</Link></button>
                    <div className="board-list">
                        
                    </div>
                </div>
            </>}
        
        
        </div>
    )
}

export default CategoryBoard;
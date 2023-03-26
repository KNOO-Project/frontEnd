import BoardForm from "./boardForm";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";

function CategoryBoard(props) {
    let navigate = useNavigate();
    return(
        <div>
        <div>
            <h2>{props.title} 게시판</h2>
            <button onClick={(e) => navigate(`/main_board/${props.category_title}_board/writing`)} >글쓰기</button>
        </div>
        <Routes>
            <Route path={`${props.category_title}_board`} element={<CategoryBoard cookies={props.cookies} category_title={'free'} title={'자유'} />}>
                <Route path="writing" element={<BoardForm />} />
            </Route>
        </Routes>
        </div>
    )
}

export default CategoryBoard;
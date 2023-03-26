import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";

function CategoryBoard(props) {
    //let navigate = useNavigate();
    return(
        <div>
        <div>
            <h2>{props.title} 게시판</h2>
            <button ><Link to={`/main_board/${props.category_title}_board/writing`} >글쓰기</Link></button>
        </div>
        <Outlet></Outlet>
        <Routes>
        <Route path='/main_board/free_board/writing' element={<BoardForm />} />

        </Routes>
        </div>
    )
}

export default CategoryBoard;
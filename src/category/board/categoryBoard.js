import BoardForm from "./boardForm";
import { Link, Route, Routes } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'

function CategoryBoard(props) {
    //let navigate = useNavigate();
    let data = JSON.parse(localStorage.getItem(`${props.category_title}_data`))
    return(
        <div className="category_board">
            {localStorage.getItem('categoryBoard_click') ? <>
                <Routes>
                    <Route path="writing" element={<BoardForm cookies={props.cookies} title={props.title} category_title={props.category_title} />} />
                </Routes>
            </> : <>
                    <div className="head">
                    <h2>{props.title} 게시판</h2>
                        <button onClick={() => {
                            localStorage.setItem('categoryBoard_click', true)
                        }} ><Link to='writing' >글쓰기</Link></button>
                    </div>
                    <div className="board-list">
                        {data.map((a, i) => {
                            return (
                                <li><div className="title" >{a.post_title}</div><div>{a.writer_name}</div><div>{a.post_date}</div></li>
                            )
                        })}
                    </div>
            </>}
        
        
        </div>
    )
}

export default CategoryBoard;
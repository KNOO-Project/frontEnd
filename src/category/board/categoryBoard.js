import BoardForm from "./boardForm";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '../../category-css/board/categoryBoard.css'
import {useEffect, useState} from 'react';
import BoardDetail from "./boardDetail";
import axios from "axios";

function CategoryBoard(props) {
    //console.log(localStorage.getItem('pathBoardTitle'))
    let categoryTitle = localStorage.getItem('pathBoardTitle');
    //let data = JSON.parse(localStorage.getItem(`${categoryTitle}_data`));
    let category_path = localStorage.getItem('pathBoardTitle')
    let [data, setData ] = useState(false);
    useEffect((categoey_path) => {
        axios.get(`/api/v1/posts/${category_path}`, {
            headers: {Authorization : props.cookies.token}
          })
          .then((res)=>{
            setTimeout(()=>{setData(res.data)}, 100);
          })
          .catch((res) => {
            console.log(res)
          })
    },[]);
    /* let [data, setData] = useState()

    const getData = async() => {
        const res = await axios.get(`/api/v1/posts/${category_path}`, {
            headers: {Authorization : props.cookies.token}
          })
          setData(res.data);
    }

    getData(); */

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
                {data ?
                <>
                    {data.map((a, i) => {
                        return(
                            <li key={i}><div className="title" onClick={() => {
                                localStorage.removeItem('categoryBoardClick');
                            }}><Link to={`detail/${a.post_id}`}>{a.post_title}</Link></div>
                            <div>{a.post_content.substring(0, 20)}</div><div className="name">{a.writer_name}</div><div className="date">{a.post_date}</div>
                            </li>
                        )
                    })}
                </>
                 : null}
                {/* {data.map((a, i) => {
                    return(
                        <li key={i}><div className="title" onClick={() => {
                            localStorage.removeItem('categoryBoardClick');
                        }}><Link to={`detail/${a.post_id}`}>{a.post_title}</Link></div><div className="name">{a.writer_name}</div><div className="date">{a.post_date}</div></li>
                        
                    )
                })} */}
            </div>
            </div>
                {/* 글쓰기 버튼 누르면 null에 해당하는 값을 보여주면서 위의 값이 감춰지고 글쓰기 페이지에 해당하는 UI 보여주기 */}
        </> : null}
                <Routes>
                    <Route path="writing" element={<BoardForm cookies={props.cookies}  />} />
                    <Route path='/detail/:post_id' element={<BoardDetail />} />
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
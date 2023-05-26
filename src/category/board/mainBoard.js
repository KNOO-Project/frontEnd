import { useState  } from "react";
import { Routes, useNavigate, useParams, Route } from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai';
import '../../category-css/board/mainBoard.css';
import axios from "axios";
import MainBoardSearch from "../../mainBoardSearch";

function MainBoard(props){

    let navigate = useNavigate();
    let [searchTypeSelected, setSearchTypeSelected] = useState('all');
    let [searchContent, setSearchContent] = useState('');

    //검색 기능
    const search = () => {
        axios.get('/api/v1/posts/search', {
            headers: {Authorization: props.cookies.token},
            params: {
                condition: searchTypeSelected,
                keyword: searchContent,
                page: 1
            }
        })
        .then((res) => {
            console.log(res);
            //setSearchData(res.data);
            navigate(`search/keyword=${searchContent}&page=1`);
        })
        .catch(() => {
            console.log('err');
        })
    }

    return(
        <>
        <div className='board'>
            <h2>메인 게시판</h2>
            <div className="head">
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
                        //navigate(`search/keyword=${searchContent}&page=1`);
                        search();
                        console.log(searchTypeSelected);
                        console.log(searchContent);
                    }} />
                </form>
            </div>
        </div>
        <Routes>
            <Route path={`search/:searchContent_page/*`} element={<MainBoardSearch  searchTypeSelected={searchTypeSelected} 
                     cookies={props.cookies}   />} />
        </Routes>
        </>
                    
    )
}

export default MainBoard;
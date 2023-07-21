import { useEffect, useState  } from "react";
import { Routes, useNavigate, useParams, Route, Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import '../../category-css/board/mainBoard.css';
import axios from "axios";
import MainBoardSearch from "../../mainBoardSearch";
import BoardDetail from "./boardDetail";
import CategoryBoard from "./categoryBoard";
import { useSelector } from 'react-redux';

function MainBoard(props){
    //let a = useSelector((state) => state.user );
    //console.log('redux', a);
    let token = props.cookies.token;
    let navigate = useNavigate();
    let params = useParams();
    //console.log(params['*']);
    let [searchTypeSelected, setSearchTypeSelected] = useState('all');
    let [searchContent, setSearchContent] = useState('');
    let [firstBoardLine, setFirstBoardLine] = useState([]);
    let [secondBoardLine, setSecondBoardLine] = useState([]);
    let firstLineTitle = ['자유', '새내기', '정보'];
    let secondLineTitle = ['취업&진로', '졸업생', '동아리&학회'];

    //검색 기능
    const search = () => {
        axios.get('/api/posts/search', {
            headers: {Authorization: token},
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
            setSearchContent('');
        })
        .catch((res) => {
            alert(res.response.data.message);
        })
    }

    useEffect(() => {
        axios.get('/api/posts', {
            headers: { Authorization: token }
        })
        .then((res) => {
            let firstLineData = [];
            let secondLineData = [];
            for(var i=0; i<3; i++){
                firstLineData.push(res.data[i]);
                secondLineData.push(res.data[i+3]);
            }
            setFirstBoardLine(firstLineData);
            setSecondBoardLine(secondLineData);
            
        })
        .catch(() => {
            console.log('err');
        })
        return () => {
            setSearchContent('');
        }
    }, []);

    console.log('searchContent', searchContent);
    //console.log('firstBoardLine', firstBoardLine);
    //console.log('secondBoardLine', secondBoardLine);

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
            { params['*'] === '' ? <div className="body">               {/* 검색하면 미리보기 창 가려주기 */}
                <div className="first_line">
                    {/* style => display flex */}
                    {firstBoardLine.map((a, i) => {
                        return(
                            <div className='preview_board_1' key={i}>
                                <li className="board_category">{firstLineTitle[i]}게시판 <span className="more_btn" onClick={(e) => {
                                    navigate(`/${a.category}_board`);
                                }}><AiOutlinePlus/> 더보기</span></li>
                                <span style={{clear:' both'}}></span>
                                {a.posts.map((b, j) => {
                                    return(
                                        <li className="post_preview" onClick={(e) => {
                                            navigate(`/${a.category}_board/detail/${b.post_id}`);
                                        }}>{b.post_content}</li>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <div className="second_line">
                    {/* style => display flex */}
                    {secondBoardLine.map((a, i) => {
                        return(
                            <div className="preview_board_2" key={i}>
                                <li className="board_category">{secondLineTitle[i]}게시판 <span className="more_btn" onClick={(e) => {
                                    navigate(`/${a.category}_board`);
                                }}><AiOutlinePlus/> 더보기</span></li>
                                {a.posts.map((b, j) => {
                                    return(
                                        <li className="post_preview" onClick={(e) => {
                                            navigate(`/${a.category}_board/detail/${b.post_id}`);
                                        }}>{b.post_content}</li>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div> : null}
        </div>
        <Routes>
            <Route path={`search/:searchContent_page/*`} element={<MainBoardSearch  searchTypeSelected={searchTypeSelected} 
                     cookies={props.cookies}   />} />
            <Route path=':categoryBoard/detail/:postId/*' element={<BoardDetail  cookies={props.cookies} />} />
            <Route path=":cateoryBoard" element={<CategoryBoard cookies={props.cookies} />} />
        </Routes>
        </>
                    
    )
}

export default MainBoard;
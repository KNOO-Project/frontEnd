import axios from "axios";
import '../../category-css/scrap/myScrap.css';
import { useEffect, useState } from "react";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiOutlineSearch} from 'react-icons/ai';
import MyScrapPagenation from "./myScrapPagenation";
import { Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import MyScrapSearch from "./myScrapSearch";

function MyScrap(props) {
    const token = props.cookies.token;
    let params = useParams();
    console.log(params)
    let navigate = useNavigate();
    let [scrapList, setScrapList] = useState([]);
    let [totalPages, setTotalPages] = useState([]);
    let [searchTypeSelected, setSearchTypeSelected] = useState('all');
    let [searchContent, setSearchContent] = useState('');

    useEffect(() => {
        axios.get('/api/v1/users/scraps', {
            headers : {Authorization: token},
            params : {
                page: 1
            }
        })
        .then((res) => {
            console.log(res);
            console.log(res.data.total_pages)
            setScrapList(res.data.posts);
            let dataLength = [];
            for(var i=1; i<=10; i++){
                dataLength.push(i);
                if(i === res.data.total_pages){
                    break;
                }
            }
            setTotalPages(dataLength)
        })
        .catch(() => {
            console.log('err')
        })
    }, [])
    console.log(scrapList);
    console.log(totalPages[0]);
    return(
        <>
        <h2>내 스크랩</h2>
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
                        navigate(`search/keyword=${searchContent}&page=1`);
                        //search();
                        console.log(searchTypeSelected);
                        console.log(searchContent);
                    }} />
                </form>
            </div>
        {params['*'] === '' ? 
        <>
            {scrapList.map((a, i) => {
                return(
                    <div key={i} className="my_scrap">
                    <Link to={`../${a.post_category}_board/detail/${a.post_id}`}>
                    <div className="my_scrap_box" >
                        <p className="title">{a.post_title}</p>
                        <p className="content">{a.post_content}</p>
                        <div className="footer">
                            <div className="date_writer">
                                <p className="date">{a.post_date}</p>
                                <p className="writer">{a.writer_name}</p>
                            </div>
                            <div className="scrapPage_icons">
                                <AiOutlineLike className="like_icon" />
                                <p className="like_count">{a.likes_count}</p>
                                <AiOutlineComment className="comment_icon" />
                                <p className="comment_count">{a.comments_count}</p>
                                <AiOutlineStar className="scrap_icon" />
                                <p className="scrap_count">{a.scraps_count}</p>
                            </div>
                            <div style={{clear: 'both'}}></div>
                        </div>
                    </div>
                    </Link>
                </div>
                )
            })}
        {/* pageNum */}
        <div className="myScrap_pageNum">
            {totalPages.map((a, i) => {
                return(
                    <Link to={`page/${a}`} key={i} style={a === 1 ? {color: '#0d6efd'} : {color: 'black'}}>
                        <li>{a}</li>
                    </Link>
                )
            })}
        </div>
        </> : null    }
        
        {/* {scrapList.length !== 0 ? scrapList.map((a, i) => {
            return(
                <div key={i} className="my_scrap">
                    <p className="title">{a.post_title}</p>
                    <p className="content">{a.post_content}</p>
                    <div className="footer">
                        <div className="date_writer">
                            <p className="date">{a.post_date}</p>
                            <p className="writer">{a.writer_name}</p>
                        </div>
                        <div className="scrapPage_icons">
                            <AiOutlineLike className="like_icon" />
                            <p className="like_count">{a.likes_count}</p>
                            <AiOutlineComment className="comment_icon" />
                            <p className="comment_count">{a.comments_count}</p>
                            <AiOutlineStar className="scrap_icon" />
                            <p className="scrap_count">{a.scraps_count}</p>
                        </div>
                        <div style={{clear: 'both'}}></div>
                    </div>
                </div>
            )
        }) : null} */} 


        <Routes>
            <Route path="page/:pageNum" element={<MyScrapPagenation token={token} />} />
            <Route path="search/:keyword_pageNum" element={<MyScrapSearch token={token} searchTypeSelected={searchTypeSelected} />} />
        </Routes>
        </>
    )

    
}

export default MyScrap;
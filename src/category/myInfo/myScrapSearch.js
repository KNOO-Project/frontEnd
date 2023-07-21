import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import '../../category-css/scrap/myScrapSearch.css';

function MyScrapSearch(props) {
    let params = useParams();
    console.log(params['keyword_pageNum']);
    let navigate = useNavigate();
    let keyword = params['keyword_pageNum'].split('&')[0].split('=')[1];
    let pageNum = params['keyword_pageNum'].split('&')[1].split('=')[1];
    let [searchList, setSearchList] = useState([]);
    let [totalPages, setTotalPages] = useState([]);
    console.log(keyword, pageNum);

    useEffect(() => {
        axios.get('/api/users/scraps/search', {
            headers: {Authorization: props.token},
            params: {
                condition: props.searchTypeSelected,
                'keyword': keyword,
                page: pageNum
            }
        })
        .then((res) => {
            console.log(res);
            setSearchList(res.data.posts);
            let dataLength = [];
            for(var i=1; i<=10; i++){
                dataLength.push(i);
                if(i === res.data.total_pages){
                    break;
                }
            }
            setTotalPages(dataLength);
        })
        .catch(() => {
            console.log('err');
        })
    }, [])
    
    console.log(searchList);
    console.log(totalPages);

    return(
        <>
        {searchList.map((a, i) => {
                return(
                    <div key={i} className="my_scrap">
                    <Link to={`../../${a.post_category}_board/detail/${a.post_id}`}>
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
        </>
    )
}

export default MyScrapSearch;

           
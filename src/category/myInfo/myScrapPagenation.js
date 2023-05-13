import axios from "axios";
import '../../category-css/myScrap.css';
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';

function MyScrapPagenation(props) {
    const token = props.token;
    let params = useParams();
    //console.log(params['pageNum']);
    var navigate = useNavigate();
    let [scrapList, setScrapList] = useState([]);
    let [totalPages, setTotalPages] = useState([]);
    let [pageClick, setPageClick] = useState(Number(params['pageNum'] <= 10 ? 0 : 1));

    useEffect(() => {
        axios.get('/api/v1/users/scraps', {
            headers : {Authorization: token},
            params : {
                page: params['pageNum']
            }
        } )
        .then((res) => {
            console.log(res);
            console.log(res.data.total_pages)
            setScrapList(res.data.posts);
            let dataLength = [];
            for(var i=((pageClick*10)+1); i<=((pageClick+1)*10); i++){
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
    }, [params['pageNum']]);

    return(
        <>
        {params['*'] !== '' ? 
        <>
            {scrapList.map((a, i) => {
                return(
                    <div key={i} className="my_scrap">
                        <div className="my_scrap_box" onClick={e => {
                        navigate(`../../${a.post_category}_board/detail/${a.post_id}`);
                        }}>
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
                    </div>
                )
            })}
            <div className="myScrap_pageNum">
            {totalPages.map((a, i) => {
                return(
                    <Link to={`../page/${a}`} key={i} style={a === 1 ? {color: '#0d6efd'} : null}>
                        <li>{a}</li>
                    </Link>
                )
            })}
            </div>
        </>    

        : null}
        </>
    )
    
}

export default MyScrapPagenation;
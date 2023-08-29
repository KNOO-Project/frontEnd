import axios from "axios";
import '../../category-css/scrap/myScrap.css';
import { useEffect, useState } from "react";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiOutlineSearch} from 'react-icons/ai';
import MyScrapPagenation from "./myScrapPagenation";
import { Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import MyScrapSearch from "./myScrapSearch";
import {BiImage} from 'react-icons/bi';

function MyScrap(props) {
    const token = props.token;
    let params = useParams();
    console.log(params)
    let navigate = useNavigate();
    let [scrapList, setScrapList] = useState([]);
    let [totalPages, setTotalPages] = useState([]);
    let [searchTypeSelected, setSearchTypeSelected] = useState('all');
    let [searchContent, setSearchContent] = useState('');
    let [diffTimeValue, setDiffTimeValue] = useState([]);

    useEffect(() => {
        axios.get('/api/users/scraps', {
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
            setTotalPages(dataLength);

            let currentDate = new Date();
            //console.log(currentDate)
            let currentDateValue = [
                {min: currentDate.getMinutes()},
                {hour: currentDate.getHours()},
                {day: currentDate.getDate()},
                {month: currentDate.getMonth() + 1},
            ]
            //console.log(currentDateValue)
            //console.log(typeof(currentDate.getMinutes()))
            let diffTime = [];
            for(var i=0; i<res.data.posts.length; i++){
                let writeDate = res.data.posts[i].post_date;
                let splitDate = writeDate.split(' ');
                let dateValue = [
                    {min: Number(splitDate[1].split(':')[1])},
                    {hour: Number(splitDate[1].split(':')[0])},
                    {day: Number(splitDate[0].split('/')[2])},
                    {month: Number(splitDate[0].split('/')[1])},
                ]


                if(currentDateValue[3]['month'] - dateValue[3]['month'] !== 0){
                    diffTime.push(Number(currentDateValue[3]['month'] - dateValue[3]['month']) + '달전');
                }else if(currentDateValue[2]['day'] - dateValue[2]['day'] !== 0){
                    if(currentDateValue[2]['day'] - dateValue[2]['day'] < 7){
                        diffTime.push(Number(currentDateValue[2]['day'] - dateValue[2]['day']) + '일전');
                    }else {
                        let week = parseInt(Number(currentDateValue[2]['day'] - dateValue[2]['day']) / 7);
                        diffTime.push(week + '주전');
                    }
                }else if(currentDateValue[1]['hour'] - dateValue[1]['hour'] !== 0){
                    if(currentDateValue[1]['hour'] - dateValue[1]['hour'] === 1 && (currentDateValue[0]['min'] < dateValue[0]['min'])){
                        diffTime.push(Number(currentDateValue[0]['min'] + 60 - dateValue[0]['min']) + '분전');    
                    }else{
                        diffTime.push(Number(currentDateValue[1]['hour'] - dateValue[1]['hour']) + '시간전');
                    }
                }else if(currentDateValue[0]['min'] - dateValue[0]['min'] !== 0){
                    diffTime.push(Number(currentDateValue[0]['min'] - dateValue[0]['min']) + '분전');
                }else if(currentDateValue[0]['min'] - dateValue[0]['min'] === 0){
                    diffTime.push('방금');
                }

            }

            setDiffTimeValue(diffTime);
        })
        .catch(() => {
            console.log('err')
        })
    }, []);

    const enterKey = (e) => {
        if(e.key === 'Enter'){
            navigate(`search/keyword=${searchContent}&page=1`);
            e.preventDefault();
        }
    }
    
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
                    <input type="text" value={searchContent} onKeyDown={enterKey} onChange={e => {
                        setSearchContent(e.target.value)
                    }} />
                    <AiOutlineSearch className="search_icon" onClick={() => {
                        navigate(`search/keyword=${searchContent}&page=1`);
                        console.log(searchTypeSelected);
                        console.log(searchContent);
                    }} />
                </form>
            </div>
        {params['*'] === '' ? 
        <>
        <div className="scrap_list">
            {scrapList.map((data, i) => {
                return(
                    <Link to={`/articles/${data.post_id}`} key={i}>   
                        <div className="title">{data.post_title}</div>
                        <div className="content">{data.post_content.substring(0, 20)
                        //본문내용 20자만 보여주기
                        }</div>
                        <div className="date">{diffTimeValue[i]}</div>
                        <div className="name">{data.writer_name}</div>
                        <div style={{clear: 'both'}}></div>
                        <div className="counts">
                            <li><AiOutlineLike style={{color: 'blue'}} />{data.likes_count}</li>
                            <li><AiOutlineComment style={{color: '#0dcaf0'}} />{data.comments_count}</li>
                            <li><AiOutlineStar style={{color: 'chartreuse'}} />{data.scraps_count}</li>
                            <li><BiImage style={{color: '#adb5bd'}} /></li>
                        </div>
                        {data.thumbnail ? <img src={data.thumbnail} alt="" /> : null}
                    </Link>
                )
            })}
        </div>    
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
        </> : null }
        
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
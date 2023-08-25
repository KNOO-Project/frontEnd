import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar} from 'react-icons/ai';
import '../../category-css/scrap/myScrapSearch.css';
import { BiImage } from "react-icons/bi";

function MyScrapSearch(props) {
    var token = props.token;
    let params = useParams();
    let navigate = useNavigate();
    console.log(params['keyword_pageNum']);
    let keyword = params['keyword_pageNum'].split('&')[0].split('=')[1];
    let pageNum = params['keyword_pageNum'].split('&')[1].split('=')[1];
    let [searchList, setSearchList] = useState([]);
    let [totalPages, setTotalPages] = useState([]);
    let [diffTimeValue, setDiffTimeValue] = useState([]);

    useEffect(() => {
        axios.get('/api/users/scraps/search', {
            headers: {Authorization: token},
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
                    if(currentDateValue[0]['min'] - dateValue[0]['min'] === 1 && (currentDateValue[0]['min'] < dateValue[0]['min'])){
                        diffTime.push(Number(currentDateValue[0]['min'] + 60 - dateValue[0]['min']) + '분전');    
                    }else{
                        diffTime.push(Number(currentDateValue[1]['hour'] - dateValue[1]['hour']) + '시간전');
                    }
                }else if(currentDateValue[0]['min'] - dateValue[0]['min'] !== 0){
                    diffTime.push(Number(currentDateValue[0]['min'] - dateValue[0]['min']) + '분전');
                }

            }

            setDiffTimeValue(diffTime);

        })
        .catch((res) => {
            alert(res.response.data.message)
            navigate('/my_scrap');
        })
    }, [params['keyword_pageNum']])
    
    console.log(searchList);
    console.log(totalPages);

    return(
        <>
        <div className="scrap_search_list">
            {searchList.map((data, i) => {
                return(
                    <Link to={`detail/${data.post_id}`} key={i}>   
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
        </>
    )
}

export default MyScrapSearch;

           
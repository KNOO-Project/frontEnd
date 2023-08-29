import axios from "axios";
import '../../category-css/scrap/myScrap.css';
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import {BiImage} from 'react-icons/bi';

function MyScrapPagenation(props) {
    const token = props.token;
    let params = useParams();
    let pageNum = params['pageNum'];
    var navigate = useNavigate();
    let [scrapList, setScrapList] = useState([]);
    let [totalPages, setTotalPages] = useState([]);
    let [pageClick, setPageClick] = useState(Number(params['pageNum'] <= 10 ? 0 : 1));
    let [diffTimeValue, setDiffTimeValue] = useState([]);

    useEffect(() => {
        axios.get('/api/users/scraps', {
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

            let currentDate = new Date();
            //console.log(currentDate)
            let currentDateValue = [
                {min: currentDate.getMinutes()},
                {hour: currentDate.getHours()},
                {day: currentDate.getDate()},
                {month: currentDate.getMonth() + 1},
                {year: currentDate.getFullYear()}
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
                    {year: Number(splitDate[0].split('/')[0])} 
                ]


                if(currentDateValue[4]['year'] - dateValue[4]['year'] !== 0){
                    diffTime.push(Number(currentDateValue[4]['year'] - dateValue[4]['year']) + '년전');
                }else if(currentDateValue[3]['month'] - dateValue[3]['month'] !== 0){
                    diffTime.push(Number(currentDateValue[3]['month'] - dateValue[3]['month']) + '달전');
                }else if(currentDateValue[2]['day'] - dateValue[2]['day'] !== 0){
                    diffTime.push(Number(currentDateValue[2]['day'] - dateValue[2]['day']) + '일전');
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
            console.log('err');
        })
    }, [params['pageNum']]);

    return(
        <>
        {params['*'] !== '' ? 
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
            <div className="myScrap_pageNum">
            {totalPages.map((a, i) => {
                return(
                    <Link to={`../page/${a}`} key={i} style={a === Number(pageNum) ? {color: '#0d6efd'} : {color: 'black'}}>
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
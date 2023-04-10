import { useEffect, useState } from "react"
import axios from "axios"
import '../../category-css/written/content.css';

function Content(props){

    let [contentList, setContentList] = useState([])
    useEffect(() => {
        axios.get('/api/v1/users', {
            headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
            console.log(res.data)
            setContentList(res.data.write_posts)
          })
          .catch(/* console.log('err') */)
    }, [])
    return(
        <>
        {contentList.map((a,i) => {
            return(
                <div className="written_content">
                    <p>{a.post_title}</p>
                </div>
            )
        })}
        </>
    )
}

export default Content;
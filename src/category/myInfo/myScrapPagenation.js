import { useParams } from "react-router-dom";

function MyScrapPagenation(props) {
    const token = props.token;
    let params =useParams();
    console.log(params['*'])
    return(
        <div>my scrap pagenation</div>
    )
}

export default MyScrapPagenation;
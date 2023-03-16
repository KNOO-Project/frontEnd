import { useState  } from "react";

function Writing(){
    let [onMouse, setOnMouse] = useState[false]
    return(
        <div className='writing'>
                    <div className='writing-title'
                    onMouseOver={() => {setOnMouse(true)}}
                    onMouseOut={() => {setOnMouse(false)}}
                    >
                    <h4>글쓰기</h4>
                    {onMouse ? 
                    <>
                    <div className='writing-box'>
                    <ul>
                        <li>자유게시판</li>
                        <li>졸업생게시판</li>
                        <li>새내기게시판</li>
                        <li>정보게시판</li>
                        <li>취업.진로</li>
                        <li>동아리.학회</li>
                    </ul>
                    </div>
                    </> 
                    : null}
                    </div>
                    
                </div>
    )
}

export default Writing;
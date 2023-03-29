import { useState  } from "react";
import { Outlet } from "react-router-dom";
function MainBoard(props){

    return(
        <div className='board'>
            <h2>메인 게시판</h2>
          {/*  {localStorage.getItem('mainBoardClick') ? <>
           {props.title}
           </> : <>
           
           </>}  */}
        </div>
                    
    )
}

export default MainBoard;
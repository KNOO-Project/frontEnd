import { useState  } from "react";
import { Outlet } from "react-router-dom";
function MainBoard(props){

    return(
        <div className='board'>
           {localStorage.getItem('boardClick') ? <>
            <Outlet title = {props.title}></Outlet>
           </> : <>
           <h4>게시판</h4>
           </>} 
        </div>
                    
    )
}

export default MainBoard;
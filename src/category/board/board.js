import { useState  } from "react";
import { Outlet } from "react-router-dom";
function Board(props){

    return(
        <div className='board'>
           {props.boardClick ? <>
            <Outlet title = {props.title}></Outlet>
           </> : <>
           <h4>게시판</h4>
           </>} 
        </div>
                    
    )
}

export default Board;
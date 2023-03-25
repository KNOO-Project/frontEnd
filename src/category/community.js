import '../category-css/community.css';
import { Button } from 'react-bootstrap';
import { useState  } from 'react';

function Community(){
    let [onMouse, setOnMouse] = useState(false);
    return(
        <div className='community'>
            <div className='menu'>
                <p>menu</p>
                
            </div>
            
        </div>
    )
}

export default Community;
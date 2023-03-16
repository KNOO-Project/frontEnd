import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Community from './category/community';
import Future from './category/future';
import Login from './category/login';
import Membership from './category/membership';
import Restaurant from './category/restaurant';
import Writing from './category/writing';
import { useState } from 'react';
//import { useState } from 'react';

function App() {
  let navigate = useNavigate();
  let [onMouse, setOnMouse] = useState(true)

  return (
    <div className="App">
      <div className='nav-bar'>
        <div className='nav-box'>
          <div onClick={()=>{navigate('/')}}><h1>KNoo</h1></div>
          <div className='text-center' onClick={()=>navigate('/community')}><h3>커뮤니티</h3></div>
          <div className='text-center' onClick={()=>navigate('/맛집')}><h3>맛집</h3></div>
          <div className='text-center' onClick={()=>navigate('/진로&취업')}><h3>진로.취업</h3></div>
          <div className='text-center' onClick={()=>navigate('/글쓰기')}>
            <h3>글쓰기</h3>
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
          <div className='text-right' onClick={()=>navigate('/login')}><h3>login</h3></div>
          <div className='text-right' onClick={()=>navigate('/회원가입')}><h3>회원가입</h3></div>
        </div>
      </div>
        
      

      <Routes>
        <Route path='/' element={
          <>
          <div className='body'>
        <div className='body-left'>
          <div className='free'>
            <h2>자유게시판</h2>
          </div>
        </div>
        <div className='body-right'>
          <div className='popular'>
            <h2>인기글</h2>
          </div>
          <div className='info-box'>
          <div className='info'>
            <h2>상담(고민, 연애...)</h2>
          </div>
          <div className='empty'></div>
          <div className='info'>
            <h2>심심풀이</h2>
          </div>
          </div>
        </div>
      </div>
      <div className='footer'>
        <div className='footer-info'>이것저것 소개, 이용문의 등등...</div>
      </div></>
        } />
        <Route path='/community' element={<Community />} />
        <Route path='/맛집' element={<Restaurant />} />
        <Route path='/진로&취업' element={<Future />} />
        <Route path='/글쓰기' element={<Writing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/회원가입' element={<Membership />} />
      </Routes>
    </div>
  );
}

export default App;

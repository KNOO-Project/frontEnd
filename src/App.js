import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Community from './category/community';
import Future from './category/future';
import Login from './category/login_out/login';
import Membership from './category/membership';
import Restaurant from './category/restaurant';
import MainBoard from './category/board/mainBoard';
import MyInfo from './category/login_out/myInfo';
import CategoryBoard from './category/board/categoryBoard';
import { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function App() {
  let navigate = useNavigate();
  let [onMouse, setOnMouse] = useState(false)
  //let [isLogin, setIsLogin] = useState(false);
  let [userInfo, setUserInfo] = useState({
    name: '', 
    email: ''
  })
  let [boardClick, setBoardClick] = useState(null);

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  return (
    <div className="App">
      <div className='nav-bar'>
        <div className='nav-box'>
          <div onClick={()=>{navigate('/')}}><h1>KNoo</h1></div>
          <div className='text-center' onClick={(e)=>{
            if(localStorage.isLogin === 'true'){
              navigate('/community')
            } else {
              alert('로그인을 해 주세요!')
            }
            }}><h3>커뮤니티</h3></div>
          <div className='text-center' onClick={(e)=>{
            if(localStorage.isLogin === 'true'){
              navigate('/맛집');
            } else {
              alert('로그인을 해 주세요!')
            }
          }
            }><h3>맛집</h3></div>
          <div className='text-center' onClick={(e)=>{
            if(localStorage.isLogin === 'true'){
              navigate('/진로&취업')
            } else {
              alert('로그인을 해 주세요!')
            }
          }
          }><h3>진로.취업</h3></div>
          <div className='text-center' 
          onMouseOver={() => {setOnMouse((prev) => !prev)}}
          onMouseOut={() => {setOnMouse((prev) => !prev)}}
          >
            <h3 onClick={(e)=>{
              setBoardClick(false)
              if(localStorage.isLogin === 'true'){
                navigate('/main_board')
              } else {
                alert('로그인을 해 주세요!')
              }
              }} >게시판</h3>
              {/* 게시판 카테고리 */}
          {onMouse ? 
                    <>
                    <div className='board-box'>
                    <ul>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/main_board/free_board')}} >자유게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/main_board/graduate_board')}} >졸업생게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/main_board/newcomer_board')}} >새내기게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/main_board/info_board')}} >정보게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/main_board/employment_board')}} >취업.진로</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/main_board/student_club_board')}} >동아리.학회</li>
                    </ul>
                    </div>
                    </> 
                    : null}
          </div>
          {/* 로그인 성공시 창 변경 logout 버튼 생성 */}
          {localStorage.getItem('isLogin') ? <>
          <div className='text-right' onClick={() => {
            //setIsLogin(false)
            localStorage.clear();
            removeCookie('token')
            navigate('/')
          }} ><h3>Logout</h3></div>
          </> : <>
          <div className='text-right' onClick={()=>navigate('/login')}><h3>login</h3></div>
          <div className='text-right' onClick={()=>navigate('/회원가입')}><h3>회원가입</h3></div>
          </>}
          {/*로그인 성공시 회원정보 조회 버튼 생성 */}
          {localStorage.getItem('isLogin') ? <>
          <div className='text-right' onClick={()=>{
            navigate('/myInfo')
            //console.log(cookies.token)
            axios.get('/api/v1/users', {
              headers: {Authorization: cookies.token} /* 헤더에 토큰 담아서 보내기 */
            })
            .then(res => {
              setUserInfo((userInfo) => ({
                ...userInfo,
                name: res.data.name,
                email: res.data.email
              }))
            })
            .catch(console.log('err'))
            }} ><h4>내 정보</h4></div>
          </> : null}
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
        <Route path='/main_board/*' element={<MainBoard boardClick={boardClick} />} >
          <Route path='free_board/*' element={<CategoryBoard cookies={cookies} category_title={'free'} title={'자유'} />} />
          <Route path='graduate_board/*' element={<CategoryBoard cookies={cookies} category_title={'graduate'} title={'졸업생'} />} />
          <Route path='newcomer_board/*' element={<CategoryBoard cookies={cookies} category_title={'newcomer'} title={'새내기'} />} />
          <Route path='info_board/*' element={<CategoryBoard cookies={cookies} category_title={'info'} title={'정보'} />} />
          <Route path='employment_board/*' element={<CategoryBoard cookies={cookies} category_title={'employment'} title={'취업&진로'} />} />
          <Route path='student_club_board/*' element={<CategoryBoard cookies={cookies} category_title={'student-club'} title={'동아리&학회'} />} />
        </Route>
        <Route path='/login' element={<Login  setCookie={setCookie} />} />
        <Route path='/회원가입' element={<Membership />} />
        <Route path='/myInfo' element={<MyInfo userInfo={userInfo} /> } />
      </Routes>
    </div>
  );
}

export default App;

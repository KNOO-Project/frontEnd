import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './category/home';
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
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  let category = ['free', 'newcomer', 'graduate', 'employment', 'student-club', 'info'];
  if(localStorage.getItem('isLogin')){
    category.map((a)=>{
      axios.get(`/api/v1/posts/${a}`, {
        headers: {Authorization : cookies.token}
      })
      .then((res)=>{
        localStorage.setItem(`${a}_data`, JSON.stringify(res.data))
      })
      .catch((console.log('err')))
    })
    
  }
  let navigate = useNavigate();
  let [onMouse, setOnMouse] = useState(false)
  //let [isLogin, setIsLogin] = useState(false);
  let [userInfo, setUserInfo] = useState({
    name: '', 
    email: ''
  })
  let [boardPage, setBoardPage] = useState();

  
  
  function moveBoard(category){                       // categoryBoard 로 넘어가는 함수
    if(localStorage.isLogin === 'true'){
      
      localStorage.setItem('boardClick', true)           // mainBoard의 true값 보여주기  (새로고침시 변화 없음)
      localStorage.removeItem('categoryBoard_click')     // categoryBoard 의 false 값 보여주기 (새로고침시 변화 없음, 다른 categoryBoard로 페이지 이동해도 오류나지 않음)
      navigate(`/main_board/${category}_board`)
    } else {
      alert('로그인을 해 주세요!')
    }
  }

  function moveCategory(path){                        // 해당 카테고리로 페이지 이동
    if(localStorage.isLogin === 'true'){
      navigate(`/${path}`)
    } else {
      alert('로그인을 해 주세요!')
    }
  }

  function moveMyInfo(){                              //회원정보조회로 페이지 이동
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
  }
  
  return (
    <div className="App">
      <div className='nav-bar'>
        <div className='nav-box'>
          <div onClick={()=>{navigate('/')}}><h1>KNoo</h1></div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('community')
            }}><h3>커뮤니티</h3></div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('맛집')
          }
            }><h3>맛집</h3></div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('진로&취업')
          }
          }><h3>진로.취업</h3></div>
          <div className='text-center' 
          onMouseOver={() => {setOnMouse((prev) => !prev)}}
          onMouseOut={() => {setOnMouse((prev) => !prev)}}
          >
            <h3 onClick={(e)=>{
              if(localStorage.isLogin === 'true'){
                localStorage.removeItem('boardClick');
                navigate(`/main_board`);
              } else {
                alert('로그인을 해 주세요!');
              }
              }} >게시판</h3>
              {/* 게시판 카테고리 */}
          {onMouse ? 
                    <>
                    <div className='board-box'>
                    <ul>
                        <li onClick={(e)=>{
                          moveBoard('free')
                          }} >자유게시판</li>
                        <li onClick={(e)=>{
                          moveBoard('graduate');
                          }} >졸업생게시판</li>
                        <li onClick={(e)=>{
                          moveBoard('newcomer');
                          }} >새내기게시판</li>
                        <li onClick={(e)=>{
                          moveBoard('info');
                          }} >정보게시판</li>
                        <li onClick={(e)=>{
                          moveBoard('employment');
                          }} >취업.진로</li>
                        <li onClick={(e)=>{
                          moveBoard('student_club');
                          }} >동아리.학회</li>
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
            moveMyInfo();
            }} ><h4>내 정보</h4></div>
          </> : null}
        </div>
      </div>
        
      

      <Routes>
        <Route path='/' element={
          <Home />
        } />
        <Route path='/community' element={<Community />} />
        <Route path='/맛집' element={<Restaurant />} />
        <Route path='/진로&취업' element={<Future />} />
        <Route path='/main_board/*' element={<MainBoard  />} >
          <Route path='free_board/*' element={<CategoryBoard cookies={cookies} category_title={'free'} title={'자유'} boardPage={boardPage} />} />
          <Route path='graduate_board/*' element={<CategoryBoard cookies={cookies} category_title={'graduate'} title={'졸업생'} boardPage={boardPage} />} />
          <Route path='newcomer_board/*' element={<CategoryBoard cookies={cookies} category_title={'newcomer'} title={'새내기'} boardPage={boardPage} />} />
          <Route path='info_board/*' element={<CategoryBoard cookies={cookies} category_title={'info'} title={'정보'} boardPage={boardPage} />} />
          <Route path='employment_board/*' element={<CategoryBoard cookies={cookies} category_title={'employment'} title={'취업&진로'} boardPage={boardPage} />} />
          <Route path='student_club_board/*' element={<CategoryBoard cookies={cookies} category_title={'student-club'} title={'동아리&학회'} boardPage={boardPage} />} />
        </Route>
        <Route path='/login' element={<Login  setCookie={setCookie} />} />
        <Route path='/회원가입' element={<Membership />} />
        <Route path='/myInfo' element={<MyInfo userInfo={userInfo} /> } />
      </Routes>
    </div>
  );
}

export default App;

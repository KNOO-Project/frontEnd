function Home(){
    return(
        <>
          <div className='body'>
          <div className='body-left'>
            <div className='free'>
              <h2>최신글</h2>
              <hr></hr>
            </div>
          </div>
          <div className='body-right'>
            <div className='popular'>
              <h2>인기글</h2>
              <hr></hr>
            </div>
            {/* <div className='info-box'>
            <div className='info'>
              <h2>상담(고민, 연애...)</h2>
            </div>
            <div className='empty'></div>
            <div className='info'>
              <h2>심심풀이</h2>
            </div>
            </div> */}
          </div>
          </div>
          <div className='footer'>
          <div className='footer-info'>
            <p>Copyright © 2023 KNoo. All rights Reserved.</p>
            <p>개발자 : 지찬우, 조성훈</p>
          </div>
      </div></>
    )
}

export default Home;
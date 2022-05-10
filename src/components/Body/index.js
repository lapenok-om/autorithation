import React, { useEffect, useState, useContext } from 'react';

import { List } from '../List';
import { TextArea } from '../TextArea';
import Pagination from '@mui/material/Pagination';
import PostContext from '../../contexts/postContext';
import UserContext from '../../contexts/userContext';
import { Header } from '../Header'
import { Footer } from '../Footer'
import { MainPage } from '../MainPage';
import { CreatePost } from '../CreatePost'
import { Item } from '../Item'

import { Routes, Route} from "react-router-dom";
import { useApi } from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import './index.css';

export const Body = () => {
    
    
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [postList, setPostList] = useState(null);
    const [postListFull, setPostListFull] = useState(null);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
    const api = useApi();
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token){
          navigate('/')

      } else {
        api.getMyInfo()
        .then(data =>setUser(data));
        navigate('/main')
      }
     
      
  }, []);
  
  
   useEffect(() => {
        if(user){
        api._token = localStorage.getItem('token');
        api.getPosts()
        .then((data) => data.sort(function(a,b){return new Date(b.created_at) - new Date(a.created_at);}))
        .then((data) => {
            setPageCount(Math.ceil(data.length / 12));
            setPostList(data.slice(12*(page - 1), 12*(page - 1) +12))});
        }

    },[page, favorites, user]);

    useEffect(() => {
      if(user){
      api._token = localStorage.getItem('token');
      api.getPosts()
      .then((data) => data.sort(function(a,b){return new Date(b.created_at) - new Date(a.created_at);}))
      .then((data) => {setPostListFull(data)});
      }
  },[favorites, user]);

  
  return (
    <UserContext.Provider value={{user, setUser}} >
    <PostContext.Provider value={{postList, setPostList, setPostListFull}}>
    <Header />
    <div className='content container '>
       <Routes>
       
          <Route path="/" element={<MainPage />}/>

          <Route path="main" element={<div>
                        <TextArea />
                        <div className='content__cards'>
                        <List setFavorites={setFavorites} postList={postList} />
                        </div>
                        <Pagination sx={{ mb: 3, mt: 3, ml: 45 }}
                                count={pageCount}
                                page={page}
                                onChange={(_,number) => setPage(number)}
                            /> 
                        </div>}/>

          <Route path="main/favourite" element={
                            <>
                            <div className='textarea_favourite'>
                              <h2 className='text'>Понравившиеся посты</h2>
                            </div>
                            <div className='content__cards'>
                            <List setFavorites={setFavorites} postList={user? postListFull?.filter((item) => (item.likes.includes(user._id))) : null } />
                            </div>
                            </>
                          } />

          <Route path="main/myPosts" element={
                            <>
                            <div className='textarea_favourite'>
                              <h2 className='text'>Мои посты</h2>
                            </div>
                            <div className='content__cards'>
                            <List setFavorites={setFavorites} postList={user? postListFull?.filter((item) => (item.author._id == user._id)) : null} />
                            </div>
                            </>
                          } />
       

          <Route path="main/posts/:itemID" element={<Item />}/>
          <Route path="main/favourite/posts/:itemID" element={<Item />}/>
          <Route path="main/myPosts/posts/:itemID" element={<Item />}/>
          <Route path="main/posts/create" element={<CreatePost />}/>
                  
        
        </Routes>
        </div> 
        <Footer />
    </PostContext.Provider>
    </UserContext.Provider>
  )
}

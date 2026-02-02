import './App.css'
import { Routes , Route } from 'react-router'
import LoginSignupPage from './components/pages/login-signup/login-signup'
import ForgetPassword from './components/pages/login-signup/components/forget-password/forget-password'
import Main from './components/pages/main/main'
import HomeDetails from './components/pages/home-details/home-details'
import UserPage from './components/pages/user-page/user-page'
import AdminPage from './components/pages/admin-page/admin-page'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LoginSignupPage/>}/>
      <Route path='/login-signup' element={<LoginSignupPage/>}/>
      <Route path='/forget-passwrod' element={<ForgetPassword/>}></Route>
      <Route path='/main-page' element={<Main/>}/>
      <Route path='/home-details/:id' element={<HomeDetails/>}/>
      <Route path='/user-page/:page' element={<UserPage/>}/>
      <Route path='/admin-page' element={<AdminPage/>}/>
    </Routes>
  )
}

export default App

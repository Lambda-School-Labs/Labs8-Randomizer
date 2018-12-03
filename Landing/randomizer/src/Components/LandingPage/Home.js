//Libraries
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// Icons
// import Gearicon from '@material-ui/icons/Settings';

// Imports
import Login from '../Login/Login';
import GoogleApi from '../GoogleApi/GoogleApi';
// Stylings
const Homediv = styled.div`
width: 500px;
height: 500px;
background-color: none;
display: flex;
justify-content: center;
flex-wrap: wrap;
border-radius: 4px;
@media (max-width: 400px) {
  height: 350px;
    
  }

`
const Signup = styled.button`
color: black;
width: 200px;
height: 60px;
background-color: #FFA5B6;
cursor: pointer;
border: none;
border-radius: 3px;
margin-right: 5px;
transition: .5s;
text-decoration: none;
font-size: 24px;

:hover {
    background-color: #bf4068;
    opacity: .9;
    color: black;
}
@media (max-width: 400px) {
    font-size: 18px;
    width: 100px;
  }
`
const Signin = styled.button`
color: black;
width: 200px;
height: 60px;
background-color: #FFA5B6;
cursor: pointer;
border: none;
border-radius: 3px;
text-decoration: none;
transition: .5s;
font-size: 24px;

:hover {
    background-color: #bf4068;
    opacity: .9;
    color: black;
}
@media (max-width: 400px) {
    font-size: 18px;
    width: 100px;
  }
`
const Welcomer = styled.h1`
font-size: 50px;

color: #72CBD3;

text-align: center;
@media (max-width: 400px) {
    font-size: 36px;
  }
`
const Welcomer2 = styled.h1`
display: flex;
text-align: center;
font-size: 24px;

color: #72CBD3;
@media (max-width: 400px) {
    font-size: 18px;
    width: 270px;
  }
`




class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {isCool: false}
      }
      toggleCoolness = () => {
        this.setState({ isCool: !this.state.isCool })
      }
   responseGoogle = response => {
       const username = response.profileObj.name
       const email = response.profileObj.email
       console.log('here', username, email)
       axios.post('https://labs8randomizer.herokuapp.com/api/tokenregister', {username:username, email:email})

       .then (res => {
         const token = res.data.key;

             localStorage.setItem('jwt', token);
             this.props.history.push('/Class');
           })
       .catch(err => {
             console.log('error')
           })
     }

    render() {
        const {isCool} = this.state;
        return (
            <Homediv>

                <Welcomer >Welcome to Randomizer </Welcomer>
                <Welcomer2>The modern way to track classroom participation</Welcomer2>

               <Link to='/Signup'>
                <Signup>Sign Up

                </Signup>
                </Link>

                <Link to='/Login'>
                <Signin onClick={this.toggleCoolness}>Login
                    {isCool ? (
                        <Login/>
                    ) : (
                        <div></div>
                    )}
                </Signin>
                </Link>
                <div>
                  <GoogleApi responseGoogle={this.responseGoogle} theme='dark'/>
                </div>

            </Homediv>
        )
    }
}
export default Home;

import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {


  // httpClient:AxiosInstance;

  constructor(){
      super();

      this.state = {
          isLogin:false,
          departmentList : [],
          user:null,
      };
  }

  componentDidMount() {
      this.httpClient = axios.create({
          baseURL:'https://kadou.i.nijibox.net/api',
          withCredentials:true,
      });
      this.loadAuth()
          .then(()=>{
            if(! this.state.isLogin){
              console.log('then')
              return Promise.resolve();
            }
              return this.loadDepartments();
          })
          .catch((err)=>{
              alert("APIがエラーを返しました\n\n" + err);
          })

      ;
  }
  loadAuth(){
    console.log('auth')
    return this.httpClient.get('/auth' , {params:{callback:'http://localhost:3000'}})
    .then(this.commonResponseHandling)
    .then((result)=>{
        console.log('result', result)
      if(result.is_login){
        console.log('login')
        this.setState({isLogin:true});
      }else if(result.auth_url){
        window.location.href = result.auth_url;
      }
    });
  }
  loadDepartments(){
    console.log('dep')
    return this.httpClient.get('/who/departments/')
    .then(this.commonResponseHandling)
    .then((result)=>{
      this.setState({departmentList : result});
      console.log(this.state.departmentList)
    })
  }
  loadUser(){
        return this.httpClient.get('/who/user/1')
          .then(this.commonResponseHandling)
          .then((result)=>{
              this.setState({user : result});
          console.log(this.state.user)
          })
  }
  loadAllUser(){
        return this.httpClient.get('/who/search?query=とも&page=1')
          .then(this.commonResponseHandling)
          .then((result)=>{
              this.setState({user : result});
          console.log(this.state.user)
          })
  }

  commonResponseHandling(res){
      console.debug(res);
      if(res.data.code !== "200"){
          console.error(res.data.data);
          return Promise.reject("API Error:" + res.data.data.message);
      }
      return Promise.resolve(res.data.data);
  }

  clickHandler = ()=>{
      this.loadUser()
          .catch((err)=>{
              alert('エラー発生');
          });
  };

  render() {
    console.log('render')
    // this.loadAllUser();
    return (
      <div className="App">
        <ul>
          {this.state.departmentList.map((row,index)=>{
              return <li key={index}>{row.department_name}</li>;
          })}
        </ul>

        { this.state.isLogin ?
            <div>
                <button onClick={this.clickHandler}>ユーザも取得してみる</button>

                { this.state.user &&
                <div>
                    { this.state.user.user_name }<br />{ this.state.user.description }
                    <img src={this.state.user.main_photo_url} alt="" />
                </div>
                }
            </div>
            :
            <p>未ログイン</p>
        }
      </div>
    );
  }
}

export default App;

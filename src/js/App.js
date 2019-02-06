/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // httpClient:AxiosInstance;

  constructor() {
    super();

    this.state = {
      isLogin: false,
      departmentList: [],
      user: null
    };
  }

  componentDidMount() {
    this.httpClient = axios.create({
      baseURL: "https://kadou.i.nijibox.net/api",
      withCredentials: true
    });
    this.loadAuth()
      .then(() => {
        if (!this.state.isLogin) {
          console.log("then");
          return Promise.resolve();
        }
        return this.loadDepartments();
      })
      .catch(err => {
        alert("APIがエラーを返しました\n\n" + err);
      });
  }

  loadAuth() {
    console.log("auth"); //auth:認証
    return this.httpClient
      .get("/auth", { params: { callback: "http://localhost:3000" } })
      .then(this.commonResponseHandling)
      .then(result => {
        console.log("result", result);
        if (result.is_login) {
          console.log("login");
          this.setState({ isLogin: true });
        } else if (result.auth_url) {
          window.location.href = result.auth_url;
        }
      });
  }

  loadDepartments() {
    console.log("dep");
    return this.httpClient
      .get("/who/departments/{department_id}")
      .then(this.commonResponseHandling)
      .then(result => {
        this.setState({ departmentList: result });
        console.log(this.state.departmentList);
      });
  }

  loadUserNumber() {
    return this.httpClient
      .get("/who/user/2")
      .then(this.commonResponseHandling)
      .then(result => {
        this.setState({ user: result });
        console.log("user", this.state.user);
      });
  }

  loadUserName() {
    return (
      this.httpClient
        //.get("/who/search?query=た&page=1")
        .get(this.handleTextChange)
        .then(this.commonResponseHandling)
        .then(result => {
          this.setState({ user: result });
          console.log(this.state.user);
        })
    );
  }

  commonResponseHandling(res) {
    console.debug(res);
    if (res.data.code !== "200") {
      console.error(res.data.data);
      return Promise.reject("API Error:" + res.data.data.message);
    }
    return Promise.resolve(res.data.data);
  }

  clickNameHandler = () => {
    this.loadUserName().catch(err => {
      alert("エラー発生");
    });
  };

  clickNumberHandler = () => {
    this.loadUserNumber().catch(err => {
      alert("エラー発生");
    });
  };

  handleTextChange(event) {
    // テキスト入力値を event オブジェクトから取得する
    const inputText = event;
    // ステートに記録する（renderメソッドが呼ばれる）
    this.setState({
      // テキスト入力の値
      inputText: "/who/search?query=" + inputText + "&page=1"
    });
  }

  handleAddClick(event) {
    // ステートから配列を持ってくる
    const taskList = this.state.taskList.concat();

    // 配列に、ステートに保持された入力済み文字を追加
    taskList.push({
      // ユニークキー（他と被らない番号という意味）
      key: Date.now(), // ユニークなキーということで時間
      completed: false, // 完了しているか
      label: this.state.inputText // タスクの文字列
    });

    // ステートに記録する（renderメソッドが呼ばれる）
    this.setState({
      // タスクの配列
      taskList: taskList
    });
  }

  render() {
    console.log("render");
    return (
      <div className="App">
        {/* 部署選択 */}
        <select>
          {this.state.departmentList.map((row, index) => {
            // map:繰り返す
            return <option key={index}>{row.department_name}</option>;
          })}
        </select>
        {this.state.isLogin ? (
          <div>
            {/* ひらがなを入力してボタンを押すと、handleTextChange()が起こる。 */}
            <form>
              <input type="text" value={this.state.some_code} />
              <button onClick={() => this.this.handleTextChange()}>
                名前から表示する
              </button>
            </form>
            {/* 番号を入力してボタンを押すと、　　が起こる。 */}
            <form>
              <input type="text" name="number" />
              <button onClick={() => this.this.loadUserNumber()}>
                番号から表示する
              </button>
            </form>

            {this.state.user && (
              <div>
                {this.state.user.user_name}
                <br />
                {this.state.user.description}
                <img src={this.state.user.main_photo_url} alt="" />
              </div>
            )}
          </div>
        ) : (
          <p>未ログイン</p>
        )}
      </div>
    );
  }
}
export default App;

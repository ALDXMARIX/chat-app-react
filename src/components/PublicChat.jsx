import React, { Component } from "react";
import { Link, BrowserRouter  } from 'react-router-dom'
const io = require("socket.io-client");

const socket = io("http://localhost:6900", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "textsadasd/plain"
  }
});

class PublicChat extends Component {

  state = {
      users: [],
      messages: [],
      message: '',
      typing: false,
      name: '',
      feedback: ''
  }

    componentWillMount() {
      
      console.log(this.state.messages)
        socket.on("ALL_CONNECTED_CLIENTS", (allclients) => {
            this.setState({
                users: allclients
            })
        })
      
        socket.on('typing', (data)=> {
            this.setState({
                feedback: data
            })
        })
      socket.on('stopped_typing', (data) => {
          this.delay(this.setState({
            feedback: data
          }), 2000)    
        })
      socket.on('clear_feedback', (data) => {
          this.delay(this.setState({
            feedback: data
          }), 2000)    
        })
      socket.on('clear_feedback_all', (data) => {
          this.delay(this.setState({
            feedback: data
          }), 2000)    
        })
      
        socket.on('message', message=> {
            this.setState({
                messages: [...this.state.messages,message],
            })
        })
        socket.on('server_message_feedback', (data)=> {
          this.setState({
            feedback: data.message
        })
        })
        socket.on('server_message', (data)=> {
          this.setState({
            messages: [...this.state.messages, data],
        })
        })
        
       
        }

      /* here the client receives all custom client data that we kept serverside for each connected client */ 
      /* do some more code here */
      
      // });
      // socket.emit("new_visitor", visitor);

      // socket.on("visitors", visitors => {
      //   this.setState({
      //     visitors: visitors
      //   })          
      // })
    
  

//   getCountryFlag = countrycode => `http://www.countryflags.io/${countrycode}/flat/64.png`

//   renderTableBody = () => {
//     const { visitors } = this.state;
//     return visitors.map((v, index) => {
//       return (
//         <tr key={index+1}>
//           <th>{index}</th>
//           <td>{v.ip}</td>
//           <td><img alt="flag" src={this.getCountryFlag(v.countrycode)}/></td>
//           <td>{v.city}</td>
//           <td>{v.state}</td>
//           <td>{v.country}</td>
//         </tr>
//       );
//     });
//   };
//     setImageURL = (url) => {
//         setState({
//         ...state,
//         image: url
//       })
//   } 

//   handleChange = (e) => {
//       setState({
//       ...state,
//       [e.target.id]: e.target.value
//     })
//  }
    handleTypingReturn = (data) => {
        this.setState({
        ...this.state,
    })
        this.setState({
        ...this.state,
    })
    }  
    handleTyping = (e) => {
        // this.setState({
        //     ...this.state,
        //     typing: true
        //   }) 
        socket.emit('typing')
    }
    handleChange = (e) => {
        this.setState({
        ...this.state,
        [e.target.id]: e.target.value
    })
    }
    handleSendMessage = (e) => {
      e.preventDefault();
      const message = this.state.message;
      socket.emit("message", message);
    }
    handleJoin = (e) => {
      e.preventDefault();
      const clientdata = {
        name: this.state.name,
        } 
        console.log(this.state.name);
      socket.emit("user_join", clientdata);
    // props.createProduct(state); 
    // props.history.push('/');
  }
    handleBlur = (e) => {
      e.preventDefault();

        this.delay(function () {
        socket.emit('stopped_typing')
        // alert('Hi, func called');
      }, 1000)}
    // props.createProduct(state); 
    // props.history.push('/');
  
  delay = (function () {
    let timer = 0;
    return async function (callback, ms) {
      clearTimeout(timer);
      timer = await setTimeout(callback, ms);
      }
  })();
  
    // $('input').keyup(function() {
    //   delay(function(){
    //     alert('Hi, func called');
    //   }, 1000 );
    // });
    
  render() {
    return (
      <React.Fragment>
        <div id="public-chat">
            <h2>Public Chat</h2>
            <div id="chat-window">
                <div id="output">
                <ul  className="slide-container">
                {this.state.messages ? this.state.messages.map((message, i) => (
                <li id="message" key={i + 1} >{message.name}: {message.message} </li>
                )): <p className="no-chat">Loading messages...</p>
              }
              </ul>
                    {/* <li className="item-a" key={product.id} >
                        <div className="box">
                              <div className="slide-img">
                              <a href={`/product/${product.id}`}>
                                  <img className="medium" src={product.image} alt={product.name} />
                              </a>
                                  <div className="overlay">
                                      <Link to='link this to shop cart' className="buy-btn">Buy Now</Link>
                                  </div>
                              </div>
                              <div className="detail-box">
                                  <div ref={textContainer} className="type" >
                                  <Link to='#' className="product-name">{product.name}</Link> */}
                                  {/* <Link to='#' onEnter={calcHeight} className="price" style={{fontSize : textHeight}}>{product.name}</Link> */}
                                  
                                  {/* if({diffDays}>10){ }   
                                    <span>New Arrival</span>
                                                            
                                  </div>
                                  <div className="price">{formatCurrency(product.price)}</div>
                              </div>
                        </div>               
                    </li>    */}
                </div>
                <div><p><em id="feedback" value={this.state.feedback}>{this.state.feedback}</em></p></div>
            </div>
            {/* <input id="handle" type="text" placeholder="Handle" /> */}
                <input id="message" type="text" placeholder="message" autoComplete="off" value={this.state.message}
                maxLength="300" onChange={this.handleChange} onKeyPress={this.handleTyping}
                onFocus={this.handleTyping} onBlur={this.handleBlur} />
                    {/* maxLength="11" onKeyPress={this.handleTyping} onKeyUp={this.handleStopTyping} /> */}
                <button id="send" onClick={this.handleSendMessage}>Send</button>
        </div>           
        <div id="public-chat">
            <h2>Create User</h2>
            <div className="input-field">
              <label htmlFor="title">Name: </label>
              <input type="text" id='name' placeholder="name" onChange={this.handleChange} maxLength="50"/>
            </div>               
            <button id="send" onClick={this.handleJoin}>Join Room</button>
            <h2>Online Users</h2>
                <ul>
                    <li className="list-user"></li> 
                </ul>
        </div>           
      </React.Fragment>
    );
  }
}

export default PublicChat;



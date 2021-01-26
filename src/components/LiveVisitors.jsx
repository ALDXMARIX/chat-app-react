import React, { Component } from "react";
import { Table } from "reactstrap";
import axios from "axios";
import openSocket from "socket.io-client";
import { Link, BrowserRouter  } from 'react-router-dom'
// const socket = openSocket("http://localhost:6600")
const io = require("socket.io-client");

const socket = io("http://localhost:6600", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "textsadasd/plain"
  }
});

class LiveVisitors extends Component {

  state = {
    visitors: []
  }

  componentWillMount() {
    axios.get('http://geoplugin.net/json.gp').then(res => {
      const {
        geoplugin_request,
        geoplugin_countryCode,
        geoplugin_city,
        geoplugin_region,
        geoplugin_countryName
      } = res.data;
      const clientdata = {
        ip: geoplugin_request,
        countrycode: geoplugin_countryCode,
        city: geoplugin_city,
        state: geoplugin_region,
        country: geoplugin_countryName
      } 

      socket.emit("SET_CLIENT_DATA", clientdata);

      socket.on("ALL_CONNECTED_CLIENTS", (allclients) => {
        this.setState({
          visitors: allclients
        })          
      })       
      /* here the client receives all custom client data that we kept serverside for each connected client */ 
      /* do some more code here */
      
      // });
      // socket.emit("new_visitor", visitor);

      // socket.on("visitors", visitors => {
      //   this.setState({
      //     visitors: visitors
      //   })          
      // })
    });
  }

  getCountryFlag = countrycode => `http://www.countryflags.io/${countrycode}/flat/64.png`

  renderTableBody = () => {
    const { visitors } = this.state;
    return visitors.map((v, index) => {
      return (
        <tr key={index+1}>
          <th>{index}</th>
          <td>{v.ip}</td>
          <td><img alt="flag" src={this.getCountryFlag(v.countrycode)}/></td>
          <td>{v.city}</td>
          <td>{v.state}</td>
          <td>{v.country}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <h2>Live Visitors</h2>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>IP</th>
              <th>Flag</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>{this.renderTableBody()}</tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default LiveVisitors;
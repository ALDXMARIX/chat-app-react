import React, { Component } from "react";
import { Table } from "reactstrap";

class LiveVisitors extends Component {

  state = {
    visitors: [
      {
        ip:"localhost",
        city:"Manila",
        state:"NCR",
        country:"Philippines"
      }
    ]
  }

  renderTableBody = () => {
    const { visitors } = this.state;
    return visitors.map((v, index) => {
      return (
        <tr>
          <th>{index}</th>
          <td>{v.ip}</td>
          <td>{v.country}</td>
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
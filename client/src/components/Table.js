import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import config from './config.json';
import Strings from './assets/Strings.js';
import { generateSignature } from './lib/TokenService.js';

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.viewItem = this.viewItem.bind(this);
  }

  viewItem() {
    const { jid, queueName } = this.props;
    this.props.history.push(`/queue/${queueName}/${jid}`);
  }

  render() {
    const {
      fullname,
      expedition,
      jacketnumber,
      created,
      locality,
      specimentype,
    } = this.props;
    return (
      <tr onClick={this.viewItem}>
        <td className="creator">{fullname}</td>
        <td className="expedition">{expedition}</td>
        <td className="jacketId">{jacketnumber}</td>
        <td className="created">{new Date(created).toISOString()}</td>
        <td className="locality">{locality}</td>
        <td className="specimenType">{specimentype}</td>
      </tr>
    );
  }
}

const queueNames = [ 'google', 'arcgis' ];
const defaultQueueRender = () => (
  <Redirect to="/queue/google" />
);

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
    this.credentials = JSON.parse(sessionStorage.getItem('user:credentials'));
    this.queueName = this.props.match.params.queueName;
  }

  itemUrl = (path) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const hmac = generateSignature({ uid: uid, time: now, path: path }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`;
    return `${urlBase}?${urlQuery}`;
  };

  checkResponse = (res) => {
    if (!res.ok) { throw { code: res.status, message: res.statusText }; }
    return res.json();
  };

  fetchItem = (path) => {
    return new Promise((resolve, reject) => {
      fetch(this.itemUrl(path))
        .then(this.checkResponse)
        .then((item) => resolve(item))
        .catch((err) => reject(err));
    });
  };

  fetchItems = async () => {
    try {
      const queueItems = await this.fetchItem(`/queue/${this.queueName}`);
      this.setState({ rows: queueItems });
    }
    catch (err) {
      this.setState({ rows: [] });
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  componentDidMount() {
    this.fetchItems();
  }

  render() {
    const tabs = queueNames.map((queueName) => {
      const classNames = queueName === this.queueName ?
        "col text-center nav-item active" : "col text-center nav-item";
      return (
        <div className={classNames}>
          <a key={queueName} className="nav-link" href={`/queue/${queueName}`}>{Strings.tableTitle[queueName]}</a>
        </div>
      );
    });
    const rows = this.state.rows.map((row) => (
      <TableRow key={row.jid} queueName={this.queueName} history={this.props.history} {...row} />
    ));
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="row navbar-nav" style={{ width: '100%' }}>
            {tabs}
          </div>
        </nav>
        <div className="table-responsive">
          <div style={{ padding: '2em' }}><h3>{Strings.tableTitle[this.queueName]}</h3></div>
          <table className="table">
            <thead>
              <tr>
                <th>{Strings.creator}</th>
                <th>{Strings.expedition}</th>
                <th>{Strings.jacketId}</th>
                <th>{Strings.created}</th>
                <th>{Strings.locality}</th>
                <th>{Strings.specimenType}</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export { defaultQueueRender, Table };

import React, { Component } from 'react';
import Select from 'react-select';

import config from './config.json';
import Strings from './assets/Strings.js';
import { generateSignature } from './lib/TokenService.js';

class GoogleItem extends Component {
  constructor(props) {
    super(props);
    this.state = { jacket: {}, participants: [], selectedParticipants: [], submitting: false };
    this.credentials = JSON.parse(sessionStorage.getItem('user:credentials'));
    this.submitParticipants = this.submitParticipants.bind(this);
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

  fetchJacket = async () => {
    try {
      const jid = this.props.match.params.jid;
      const jacket = await this.fetchItem(`/queue/google/${jid}`);
      this.setState({ jacket: jacket });
      const participants = await this.fetchItem(`/queue/google/participants`);
      participants.sort((a, b) => a.fullname.toUpperCase() > b.fullname.toUpperCase() ? 1 : -1);
      this.setState({ participants: participants });
    }
    catch (err) {
      this.setState({ jacket: {}, participants: [] });
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  componentDidMount() {
    this.fetchJacket();
  }

  submitParticipants = async () => {
    this.setState({ submitting: true });
    const selectedUids = this.state.selectedParticipants.map((participant) => participant.uid);
    // TODO
  };

  render() {
    const jid = this.props.match.params.jid;
    const {
      fullname,
      email,
      expedition,
      jacketnumber,
      created,
      locality,
      specimentype,
    } = this.state.jacket;
    const userLink = (
      <a href={`mailto:${email}`}>{fullname}</a>
    );
    const createdString = created ? new Date(created).toISOString() : '';
    const participants = this.state.participants;
    return (
      <div>
        <button disabled={this.state.submitting} onClick={this.submitParticipants} className={'btn btn-success col-md-3'}>
          <span className="h5">{Strings.submitParticipants}</span>
        </button>
        <Select
          getOptionLabel={(item) => `${item.fullname} <${item.email}>`}
          getOptionValue={(item) => item.uid}
          isClearable
          isMulti
          isSearchable
          name="participants"
          onChange={(value) => { this.setState({ selectedParticipants: value }); }}
          options={participants}
          placeholder={Strings.participants}
        />
        <div className="table-responsive">
          <div><h3>{Strings.itemTitle} {jid}</h3></div>
          <table className="table">
            <tbody>
              <tr className="creator">
                <td>{Strings.creator}</td><td>{userLink}</td>
              </tr>
              <tr className="expedition">
                <td>{Strings.expedition}</td><td>{expedition}</td>
              </tr>
              <tr className="jacketId">
                <td>{Strings.jacketId}</td><td>{jacketnumber}</td>
              </tr>
              <tr className="created">
                <td>{Strings.created}</td><td>{createdString}</td>
              </tr>
              <tr className="locality">
                <td>{Strings.locality}</td><td>{locality}</td>
              </tr>
              <tr className="specimenType">
                <td>{Strings.specimenType}</td><td>{specimentype}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default GoogleItem;

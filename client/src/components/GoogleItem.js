import React, { Component } from 'react';
import Select from 'react-select';

import config from './config.json';
import Strings from './assets/Strings.js';
import { generateSignature } from './lib/TokenService.js';

import greenCheck from './assets/green-check.svg';
import redX from './assets/red-x.svg';

class GoogleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: false,
      jacket: {},
      participants: [],
      selectedParticipants: [],
      submitting: false,
    };
    this.credentials = JSON.parse(sessionStorage.getItem('user:credentials'));
    this.submitParticipants = this.submitParticipants.bind(this);
  }

  itemUrl = (path, body) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const hmac = generateSignature({ uid: uid, time: now, path: path, ...body }, token);
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

  uploadItem = (path, item) => {
    return new Promise((resolve, reject) => {
      fetch(this.itemUrl(path, item), {
        body: JSON.stringify(item),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })
        .then(this.checkResponse)
        .then((answer) => resolve(answer))
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
    const jid = this.props.match.params.jid;
    this.setState({ submitting: true });
    const selectedUids = this.state.selectedParticipants.map((participant) => participant.uid);
    try {
      const answer = await this.uploadItem(`/queue/google/${jid}/participants`, selectedUids);
      this.setState({ answer: answer });
    }
    catch (err) {
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
    this.setState({ submitting: false });
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
    const { answer, participants, submitting } = this.state;
    return (answer) ? (
      <div>
        <div><img src={answer.status==='ok' ? greenCheck : redX} style={{ width: 100, height: 100 }} /></div>
        <div>{answer.status}</div>
        <div>{answer.message}</div>
        { answer.remaining_members && (
          <div className="table-responsive"><table className="table"><tbody>
            { answer.remaining_members.map((member, index) => (
              <tr key={index}><td>{member}</td></tr>
            ))}
          </tbody></table></div>
        )}
        <div><button onClick={() => this.props.history.push('/queue/google')} className={'btn btn-success col-md-3'}><span className="h5">{Strings.returnToQueue}</span></button></div>
      </div>
    ) : (
      <div>
        <button disabled={submitting} onClick={this.submitParticipants} className={'btn btn-success col-md-3'}>
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

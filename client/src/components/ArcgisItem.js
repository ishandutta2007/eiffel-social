import React, { Component } from 'react';

import config from './config.json';
import Strings from './assets/Strings.js';
import { generateSignature } from './lib/TokenService.js';

class ArcgisItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      hasPhotos: false,
      jacket: {},
      localityId: '',
      permitNumber: '',
    };
    this.credentials = JSON.parse(sessionStorage.getItem('user:credentials'));
    this.done = this.done.bind(this);
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

  deleteItem = (path) => {
    return new Promise((resolve, reject) => {
      fetch(this.itemUrl(path), {
        method: 'DELETE',
      })
        .then(this.checkResponse)
        .then((answer) => resolve(answer))
        .catch((err) => reject(err));
    });
  };

  fetchHasPhotos = async () => {
    try {
      const jid = this.props.match.params.jid;
      const answer = await this.fetchItem(`/queue/arcgis/${jid}/hasPhotos`);
      this.setState({ hasPhotos: answer.hasPhotos });
    }
    catch (err) {
      this.setState({ disabled: true, jacket: {} });
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  fetchJacket = async () => {
    try {
      const jid = this.props.match.params.jid;
      const jacket = await this.fetchItem(`/queue/arcgis/${jid}`);
      this.setState({ jacket: jacket });
      if (jacket.locality in config) {
        this.setState(config[jacket.locality]);
      }
      else {
        this.setState({ disabled: true });
      }
    }
    catch (err) {
      this.setState({ disabled: true, jacket: {} });
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  componentDidMount() {
    this.fetchHasPhotos();
    this.fetchJacket();
  }

  done = async () => {
    if (!window.confirm(Strings.areYouSure)) { return; }
    const jid = this.props.match.params.jid;
    try {
      await this.deleteItem(`/queue/arcgis/${jid}`);
      this.props.history.push('/queue/arcgis');
    }
    catch (err) {
      alert(`${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  render() {
    const jid = this.props.match.params.jid;
    const {
      jacketnumber,
      created,
      locality,
      specimentype,
      notes,
      tid,
    } = this.state.jacket;
    const downloadPhotosLink = this.itemUrl(`/queue/arcgis/${jid}/photo`)
    const permitNumber = encodeURIComponent(this.state.permitNumber);
    const collectionDate = new Date(created);
    const pad = (n) => (n>9 ? n : '0' + n);
    const collectionDateString = `${collectionDate.getFullYear()}-${pad(collectionDate.getMonth())}-${pad(collectionDate.getDate())}`;
    const comment = encodeURIComponent(notes);
    const photoId = encodeURIComponent(`Specimen #: ${jacketnumber} // Photo ID: [INSERT_PHOTO_ID]`);
    const visitLink = `https://survey123.arcgis.com/share/${config.visitFormId}?field:PL_LCLTY_ID=${this.state.localityId}&field:LCLTY_PRMT_NB=${permitNumber}&field:LCLTY_CLLCT_DT=${collectionDateString}&field:LCLTY_CMMNT_TX=${comment}`;
    const documentsLink = `https://survey123.arcgis.com/share/${config.documentsFormId}?field:LocalityID=${this.state.localityId}&field:Comment1=${photoId}`;
    return this.state.disabled ? (
      <div>
        <div className="table-responsive">
          <div className="alert-warning"><h3>{Strings.localityNotFound} {jid} {locality}</h3></div>
          <table className="table">
            <tbody>
              <tr className="specimenComments">
                <td>{Strings.specimenComments}</td>
                <td>{`Specimen #: ${jacketnumber} // Tag ID: ${tid} // Specimen type: ${specimentype}`}</td>
              </tr>
              <tr className="downloadPhotos">
                <td>{Strings.downloadPhotos}</td>
                <td><a className={'btn btn-success col-md-3'} href={downloadPhotosLink}>{Strings.downloadPhotos}</a></td>
              </tr>
              <tr className="cancel">
                <td>{Strings.returnToQueue}</td>
                <td><button onClick={() => this.props.history.push('/queue/arcgis')} className={'btn btn-success col-md-3'}><span className="h5">{Strings.cancel}</span></button></td>
              </tr>
              <tr className="done">
                <td>{Strings.deleteAndReturnToQueue}</td>
                <td><button onClick={this.done} className={'btn btn-success col-md-3'}><span className="h5">{Strings.done}</span></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <div>
        <div className="table-responsive">
          <div><h3>{Strings.itemTitle} {jid}</h3></div>
          <table className="table">
            <tbody>
              <tr className="specimenComments">
                <td>{Strings.specimenComments}</td>
                <td>{`Specimen #: ${jacketnumber} // Tag ID: ${tid} // Specimen type: ${specimentype}`}</td>
              </tr>
              <tr className="visitLink">
                <td>{Strings.visitLink}</td>
                <td><a className={'btn btn-success col-md-3'} href={visitLink} target="_blank">{Strings.visitLink}</a></td>
              </tr>
              <tr className="downloadPhotos">
                <td>{Strings.downloadPhotos} ({this.state.hasPhotos ? 'true' : 'false'})</td>
                <td><a className={'btn btn-success col-md-3'} href={downloadPhotosLink}>{Strings.downloadPhotos}</a></td>
              </tr>
              <tr className="documentsLink">
                <td>{Strings.documentsLink}</td>
                <td><a className={'btn btn-success col-md-3'} href={documentsLink} target="_blank">{Strings.documentsLink}</a></td>
              </tr>
              <tr className="cancel">
                <td>{Strings.returnToQueue}</td>
                <td><button onClick={() => this.props.history.push('/queue/arcgis')} className={'btn btn-success col-md-3'}><span className="h5">{Strings.cancel}</span></button></td>
              </tr>
              <tr className="done">
                <td>{Strings.deleteAndReturnToQueue}</td>
                <td><button onClick={this.done} className={'btn btn-success col-md-3'}><span className="h5">{Strings.done}</span></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ArcgisItem;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/app';
import { uploadRuleset } from '../../actions/ruleset';
import { TitlePanel } from '../../components/panel/panel';
import Button from '../../components/button/button';
import { createHashHistory } from 'history';
import FooterLinks from '../../components/footer/footer';
import footerLinks from '../../data-objects/footer-links.json';
import { includes } from 'lodash/collection';
import Notification from '../../components/notification/notification';
import { RULE_AVAILABLE_UPLOAD, RULE_UPLOAD_ERROR } from '../../constants/messages';
import ApperanceContext from '../../context/apperance-context';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import Table from '../../components/table/table';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Search from '../../components/search/search';
import Loader from '../../components/loader/loader';

function readFile(file, cb) {
  // eslint-disable-next-line no-undef
  var reader = new FileReader();
  reader.onload = () => {
    try {
      cb(JSON.parse(reader.result), file.name);
    } catch (e) {
      cb(undefined, undefined, e.message);
    }
  }
  return reader.readAsText(file);
}

class HomeContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uploadedFilesCount: 0,loading: true, files: [], ruleset: {}, uploadError: false, fileExist: false, message: {}, rule: {},
      ruleList: []
    };
    this.drop = this.drop.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.printFile = this.printFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.chooseDirectory = this.chooseDirectory.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    this.props.login();
    // Make your HTTP call here
    const headers = {
      'Content-Type': 'application/json'
    };
    axios.get('https://eg-demo-tickets-events-test-2.azurewebsites.net/api/GodBlessMicrosoftHttpTrigger1?code=0RyJFcbfnhVL_n_5x43dIhMwS48U5nIC8QK0cXHHneoBAzFuAWrHxA==', { headers })
      .then(data => {
        this.setState({ ruleList: data.data, loading: false })
        console.log(data);
        //this.props.login();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSearch(value) {
    this.props.searchTxt(value);
  }

  handleEdit(e, rule) {
    e.preventDefault();
    this.props.uploadRuleset(rule);
    console.log(rule);
    console.log(this.props.ruleset);
    // this.props.addRuleset(rule.name);

    // for(let ele=0;ele<rule.attributes.length;ele++){
    //   this.props.handleAttribute('ADD', rule.attributes[ele]);
    // }
    // for(let ele=0;ele<rule.decisions.length;ele++){
    //   this.props.handleDecisions('ADD', rule.decisions[ele]);
    // }
    this.navigate('./ruleset');
  }

  allowDrop(e) {
    e.preventDefault();
  }

  printFile(file, name, error) {
    if (error) {
      this.setState({ uploadError: true, fileExist: false, message: RULE_UPLOAD_ERROR });
    } else {
      const isFileAdded = this.state.files.some(fname => fname === name) || includes(this.props.rulenames, file.name);
      if (!isFileAdded) {
        const files = this.state.files.concat([name]);
        const ruleset = this.state.ruleset.concat(file);
        this.setState({ files, ruleset, fileExist: false });
      } else {
        const message = { ...RULE_AVAILABLE_UPLOAD, heading: RULE_AVAILABLE_UPLOAD.heading.replace('<name>', file.name) };
        this.setState({ fileExist: true, message });
      }
    }

  }

  uploadFile(items, index) {
    const file = items[index].getAsFile();
    readFile(file, this.printFile);
  }

  uploadDirectory(item) {
    var dirReader = item.createReader();
    const print = this.printFile;
    dirReader.readEntries(function (entries) {
      for (let j = 0; j < entries.length; j++) {
        let subItem = entries[j];
        if (subItem.isFile) {
          subItem.file((file) => {
            readFile(file, print);
          });
        }
      }
    });
  }

  // this method is not required. its to select files from local disk.
  /* chooseFile() {
   const file = document.getElementById("uploadFile");
   if (file && file.files) {
     for (let i = 0; i < file.files.length; i++) {
       readFile(file.files[i], this.printFile);
     }
   }
  } */

  chooseDirectory(e) {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'application/json') {
          readFile(files[i], this.printFile);
        }
      }
    }
  }

  drop(e) {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i].webkitGetAsEntry();
        if (item.isFile) {
          this.uploadFile(items, i);
        } else if (item.isDirectory) {
          this.uploadDirectory(item);
        }
      }
    }
  }

  handleUpload() {
    if (this.state.ruleset.length > 0) {
      this.props.uploadRuleset(this.state.ruleset);
      this.navigate('./ruleset');
    }
  }

  navigate(location) {
    const history = createHashHistory();
    this.props.login();
    history.push(location);
  }

  render() {
    const { background } = this.context;
    const { ruleList } = this.state;
    const formElements = ruleList.map((rule, index) =>
    (<tr key={rule.id + index}>
      <td><p>{rule.name}</p></td>
      <td><p>{rule.businessObject}</p></td>
      <td><p>{rule.type}</p></td>
      <td><p>{rule.eventType}</p></td>
      <td><p>{rule.status}</p></td>
      <td>
        <a href="" style={{ paddingRight: '20px' }} onClick={(e) => this.handleEdit(e, rule)} ><FontAwesomeIcon icon={faPenToSquare} /></a>
        <a href="" ><FontAwesomeIcon icon={faTrash} /></a>
      </td>
    </tr>)
    );
    return (<React.Fragment>
      {/* {this.state.removeAlert && this.removeAlert()}
                {this.state.successAlert && this.successAlert()} */}
      <div className="home-container">
        <div className={`attributes-header ${background}`}>
          <div className="attr-link">
            <span className="plus-icon" /><span className="text">Add</span>
          </div>
          <div className="attr-link">
            <span className="reset-icon" /><span className="text">Reset</span>
          </div>
          <div><Search onConfirm={this.handleSearch} onChange={this.handleSearch} /></div>
        </div>
        { this.state.loading && <Loader /> }
        <Table columns={['Description', 'Business Object', 'Type','Event Type', 'Status', 'Action']}>
          {!this.state.loading &&formElements}
        </Table>
      </div>
    </React.Fragment>
    );

    // const { fileExist, uploadError, message } = this.state;
    // const title = this.props.loggedIn ? "Upload Rules" : "Create / Upload Rules";
    // const appctx = this.context;

    // return <div className="home-container">
    //   <div className="single-panel-container">
    //   { (fileExist || uploadError) && <Notification body={message.body} heading={message.heading} type={message.type} /> }
    //     <TitlePanel title={title} titleClass={faCloudArrowUp}>
    //       <div className="upload-panel">
    //         <div className={`drop-section ${appctx.background}`} onDrop={this.drop} onDragOver={this.allowDrop}>
    //             <div><label htmlFor="uploadFile">Choose Ruleset directory<input id="uploadFile" type="file" onChange={this.chooseDirectory} webkitdirectory="true" multiple/></label> or Drop Files</div>
    //             {this.state.files.length > 0 && <div className="file-drop-msg">{`${this.state.files.length} json files are dropped!`}</div>}
    //         </div>
    //       </div>
    //       <div className="btn-group">
    //         <Button label={"Upload"} onConfirm={this.handleUpload} classname="primary-btn" type="button" />
    //         {!this.props.loggedIn && <Button label={"Create"} onConfirm={() => this.navigate('./create-ruleset')} classname="primary-btn" type="button" disabled={this.state.files.length > 0} />}
    //       </div>
    //     </TitlePanel>
    //   </div>
    //   {!this.props.loggedIn && <div className='footer-container home-page'>
    //      <FooterLinks links={footerLinks} />
    //   </div>}
    // </div>
  }
}

HomeContainer.contextType = ApperanceContext;

HomeContainer.propTypes = {
  ruleset: PropTypes.object,
  uploadRuleset: PropTypes.func,
  login: PropTypes.func,
  loggedIn: PropTypes.bool,
  rulenames: PropTypes.array,
}

HomeContainer.defaultProps = {
  rulenames: [],
  ruleset: {},
  uploadRuleset: () => false,
  login: () => false,
  loggedIn: false,
}

const mapStateToProps = (state) => ({
  rulenames: state.ruleset.rulesets.map(r => r.name),
  loggedIn: state.app.loggedIn,
  ruleset: state.rule
});

const mapDispatchToProps = (dispatch) => ({

  login: () => dispatch(login()),
  uploadRuleset: (ruleset) => dispatch(uploadRuleset(ruleset)),

});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
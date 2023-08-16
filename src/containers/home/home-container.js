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
      uploadedFilesCount: 0, files: [], ruleset: [], uploadError: false, fileExist: false, message: {},
      ruleList: [
        {
          "id": "64ab972714c88c0d98ef7ce1",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "W1 & W2 RO Call Owner Determination - 3rd Party Warranty Provider/Retailer",
          "attributes": [
            {
              "name": "LX_PRD_CH1_KUT",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "array"
            },
            {
              "name": "LX_TKT_EXW_PRV_KUT",
              "type": "string"
            },
            {
              "name": "Country",
              "type": "array"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_PRD_CH1_KUT",
                    "operator": "equal",
                    "value": "500"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "in",
                    "value": [
                      "Z7",
                      "Z6"
                    ]
                  },
                  {
                    "fact": "LX_TKT_EXW_PRV_KUT",
                    "operator": "notEqual",
                    "value": ""
                  },
                  {
                    "fact": "Country",
                    "operator": "in",
                    "value": [
                      "ES",
                      "FR",
                      "PL",
                      "CZ",
                      "SK"
                    ]
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "TicketOwnedBy_KUT": "121"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": true,
            "field": {
              "name": "TicketOwnedBy_KUT",
              "value": "121"
            },
            "innerObject": {
              "name": "Country",
              "value": "ServiceRequestUsedAddress"
            }
          }
        },
        {
          "id": "64ab977f14c88c0d98ef7ce2",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "W1 & W2 RO Call Owner Determination - ISP",
          "attributes": [
            {
              "name": "LX_PRD_CH1_KUT",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "array"
            },
            {
              "name": "Country",
              "type": "array"
            },
            {
              "name": "LX_TKT_EXW_PRV_KUT",
              "type": "string"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_PRD_CH1_KUT",
                    "operator": "equal",
                    "value": "500"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "in",
                    "value": [
                      "Z7",
                      "Z6"
                    ]
                  },
                  {
                    "fact": "Country",
                    "operator": "in",
                    "value": [
                      "NO",
                      "FI",
                      "PT"
                    ]
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "TicketOwnedBy_KUT": "111"
                }
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_PRD_CH1_KUT",
                    "operator": "equal",
                    "value": "500"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "in",
                    "value": [
                      "Z7",
                      "Z6"
                    ]
                  },
                  {
                    "fact": "Country",
                    "operator": "in",
                    "value": [
                      "ES",
                      "FR",
                      "PL",
                      "CZ",
                      "SK"
                    ]
                  },
                  {
                    "fact": "LX_TKT_EXW_PRV_KUT",
                    "operator": "equal",
                    "value": ""
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "TicketOwnedBy_KUT": "111"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": true,
            "field": {
              "name": "TicketOwnedBy_KUT",
              "value": "111"
            },
            "innerObject": {
              "name": "Country",
              "value": "ServiceRequestUsedAddress"
            }
          }
        },
        {
          "id": "64ab97d314c88c0d98ef7ce3",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "IT Protocollo/Goodwill Action Needed",
          "attributes": [
            {
              "name": "LX_TCK_EScurrencyCode_KUT",
              "type": "string"
            },
            {
              "name": "Country",
              "type": "array"
            },
            {
              "name": "LX_TCK_EScontent_KUT",
              "type": "number"
            },
            {
              "name": "LX_TCK_CE_KUT",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "string"
            },
            {
              "name": "LX_TCK_CVRG_KUT",
              "type": "array"
            },
            {
              "name": "ApprovalStatusCode",
              "type": "array"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "Country",
                    "operator": "in",
                    "value": [
                      "IT",
                      "SM",
                      "VA"
                    ]
                  },
                  {
                    "fact": "LX_TCK_EScontent_KUT",
                    "operator": "greaterThan",
                    "value": 25000
                  },
                  {
                    "fact": "LX_TCK_EScurrencyCode_KUT",
                    "operator": "equal",
                    "value": "EUR"
                  },
                  {
                    "fact": "LX_TCK_CE_KUT",
                    "operator": "equal",
                    "value": "101"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "Z6"
                  },
                  {
                    "fact": "LX_TCK_CVRG_KUT",
                    "operator": "in",
                    "value": [
                      "ZP",
                      "ZE"
                    ]
                  },
                  {
                    "fact": "ApprovalStatusCode",
                    "operator": "in",
                    "value": [
                      "1",
                      "2"
                    ]
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "Z6"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": true,
            "field": {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "value": "Z6"
            },
            "innerObject": {
              "name": "Country",
              "value": "ServiceRequestUsedAddress"
            }
          }
        },
        {
          "id": "64ab980314c88c0d98ef7ce4",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "Reset Release to Back Office flag",
          "attributes": [
            {
              "name": "ItemListServiceRequestExecutionLifeCycleStatusCode",
              "type": "string"
            },
            {
              "name": "ResolutionCode_KUT",
              "type": "string"
            },
            {
              "name": "LX_TKT_BO_KUT",
              "type": "object"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "ItemListServiceRequestExecutionLifeCycleStatusCode",
                    "operator": "equal",
                    "value": "6"
                  },
                  {
                    "fact": "ResolutionCode_KUT",
                    "operator": "equal",
                    "value": "121"
                  },
                  {
                    "fact": "LX_TKT_BO_KUT",
                    "operator": "equal",
                    "value": true
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "LX_TKT_BO_KUT": false
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": false,
            "field": {
              "name": "LX_TKT_BO_KUT",
              "value": false
            }
          }
        },
        {
          "id": "64ab985114c88c0d98ef7ce5",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "Set Ticket Status to Completed Once Claim is Approved or Rejected",
          "attributes": [
            {
              "name": "LX_TKT_CLMSTS_KUT",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "string"
            },
            {
              "name": "Country",
              "type": "array"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_TKT_CLMSTS_KUT",
                    "operator": "equal",
                    "value": "Z3"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "5"
                  },
                  {
                    "fact": "Country",
                    "operator": "notIn",
                    "value": [
                      "IT",
                      "GB",
                      "VA",
                      "SM"
                    ]
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_TKT_CLMSTS_KUT",
                    "operator": "in",
                    "value": [
                      "Z4",
                      "Z6"
                    ]
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "5"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_TKT_CLMSTS_KUT",
                    "operator": "equal",
                    "value": "Z7"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "5"
                  },
                  {
                    "fact": "Country",
                    "operator": "in",
                    "value": [
                      "IT",
                      "GB",
                      "VA",
                      "SM"
                    ]
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": true,
            "field": {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "value": "5"
            },
            "innerObject": {
              "name": "Country",
              "value": "ServiceRequestUsedAddress"
            }
          }
        },
        {
          "id": "64ab985114c88c0d98ef7ce6",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "Coverage, Retailer & Status PPP update for MyAccount Tickets",
          "attributes": [
            {
              "name": "Name",
              "type": "string"
            },
            {
              "name": "DataOriginTypeCode",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "string"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "Name",
                    "operator": "includes",
                    "value": "Confirmed - Online Service Booking"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "equal",
                    "value": "Z3"
                  },
                  {
                    "fact": "DataOriginTypeCode",
                    "operator": "equal",
                    "value": "4"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "LX_PRD_RET": "38",
                  "ServiceRequestUserLifeCycleStatusCode": "Z4"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": false,
            "field": {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "value": "Z4"
            }
          }
        },
        {
          "id": "64ab985114c88c0d98ef7ce7",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "Set status to completed for OOW Lead tickets +W2 Countries",
          "attributes": [
            {
              "name": "Country",
              "type": "array"
            },
            {
              "name": "ActivityServiceIssueCategoryID",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "string"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "Country",
                    "operator": "in",
                    "value": [
                      "IT",
                      "SM",
                      "VA",
                      "PL",
                      "CZ",
                      "SK"
                    ]
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "equal",
                    "value": "Z7"
                  },
                  {
                    "fact": "ActivityServiceIssueCategoryID",
                    "operator": "equal",
                    "value": "1.1.1.1.14"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": true,
            "field": {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "value": "Z4"
            },
            "innerObject": {
              "name": "Country",
              "value": "ServiceRequestUsedAddress"
            }
          }
        },
        {
          "id": "64ab985114c88c0d98ef7ce8",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "Set Pre- Sales Tickets to be Completed",
          "attributes": [
            {
              "name": "ResolutionCode_KUT",
              "type": "string"
            },
            {
              "name": "ActivityServiceIssueCategoryID",
              "type": "string"
            },
            {
              "name": "LX_TKT_EXTERNALID_KUT",
              "type": "string"
            },
            {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "type": "string"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "ResolutionCode_KUT",
                    "operator": "equal",
                    "value": "271"
                  },
                  {
                    "fact": "LX_TKT_EXTERNALID_KUT",
                    "operator": "equal",
                    "value": ""
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "5"
                  },
                  {
                    "fact": "ActivityServiceIssueCategoryID",
                    "operator": "equal",
                    "value": "1.1.1.1.17"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "fact": "ResolutionCode_KUT",
                    "operator": "equal",
                    "value": "291"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "5"
                  },
                  {
                    "fact": "ActivityServiceIssueCategoryID",
                    "operator": "equal",
                    "value": "1.1.1.1.15"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "fact": "ResolutionCode_KUT",
                    "operator": "equal",
                    "value": "271"
                  },
                  {
                    "fact": "ServiceRequestUserLifeCycleStatusCode",
                    "operator": "notEqual",
                    "value": "5"
                  },
                  {
                    "fact": "ActivityServiceIssueCategoryID",
                    "operator": "equal",
                    "value": "1.1.1.1.18"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ServiceRequestUserLifeCycleStatusCode": "5"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": false,
            "field": {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "value": "Z4"
            }
          }
        },
        {
          "id": "64ab985114c88c0d98ef7ce9",
          "type": "Field Update",
          "status": "Active",
          "businessObject": "Ticket",
          "name": "Resolution category defaulting",
          "attributes": [
            {
              "name": "LX_TCK_CVRG_KUT",
              "type": "array"
            },
            {
              "name": "Country",
              "type": "string"
            }
          ],
          "decisions": [
            {
              "conditions": {
                "all": [
                  {
                    "fact": "LX_TCK_CVRG_KUT",
                    "operator": "in",
                    "value": [
                      "ZQ",
                      "ZR",
                      "ZS",
                      "ZT"
                    ]
                  },
                  {
                    "fact": "Country",
                    "operator": "equal",
                    "value": "GB"
                  }
                ]
              },
              "event": {
                "type": "Ticket.Root.Updated",
                "params": {
                  "ActivityServiceIssueCategoryID": "1.1.1.1.7"
                }
              }
            }
          ],
          "config": {
            "isInnerObjectRequired": true,
            "field": {
              "name": "ServiceRequestUserLifeCycleStatusCode",
              "value": "Z4"
            },
            "innerObject": {
              "name": "Country",
              "value": "ServiceRequestUsedAddress"
            }
          }
        }
      ]
    };
    this.drop = this.drop.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.printFile = this.printFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.chooseDirectory = this.chooseDirectory.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props.login();
    // Make your HTTP call here
    // const headers = {
    //   'Content-Type': 'application/json'
    // };
    // axios.get('https://eg-demo-tickets-events-test-2.azurewebsites.net/api/GodBlessMicrosoftHttpTrigger1?code=0RyJFcbfnhVL_n_5x43dIhMwS48U5nIC8QK0cXHHneoBAzFuAWrHxA==', { headers })
    //   .then(data => {
    //     this.setState({ ruleList: data.data })
    //     console.log(data);
    //     //this.props.login();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  handleSearch(value) {
    this.props.searchTxt(value);
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
    (<tr key={rule.name + index || 'item' + index}>
      <td><p>{rule.name}</p></td>
      <td><p>{rule.businessObject}</p></td>
      <td><p>{rule.type}</p></td>
      <td><p>{rule.status}</p></td>
      <td>
        <a style={{ paddingRight: '20px' }} href="" ><FontAwesomeIcon icon={faPenToSquare} /></a>
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
        <Table columns={['Description', 'Business Object', 'Type', 'Status', 'Action']}>
          {formElements}
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
  ruleset: PropTypes.array,
  uploadRuleset: PropTypes.func,
  login: PropTypes.func,
  loggedIn: PropTypes.bool,
  rulenames: PropTypes.array,
}

HomeContainer.defaultProps = {
  rulenames: [],
  ruleset: [],
  uploadRuleset: () => false,
  login: () => false,
  loggedIn: false,
}

const mapStateToProps = (state) => ({
  rulenames: state.ruleset.rulesets.map(r => r.name),
  loggedIn: state.app.loggedIn,
});

const mapDispatchToProps = (dispatch) => ({

  login: () => dispatch(login()),
  uploadRuleset: (ruleset) => dispatch(uploadRuleset(ruleset)),

});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
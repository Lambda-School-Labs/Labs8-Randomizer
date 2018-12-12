// Libraries
import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { withAlert } from "react-alert";

//Icons
import Deleteicon from '@material-ui/icons/Delete';
import Addbutton from '@material-ui/icons/AddCircle';
import Pencil from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save';

//Components
import AlertDialog from './AlertDialog';
import ResetDialog from './ResetDialog';
import EditDialog from './EditDialog';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

//Library
const PapaParse = require('papaparse/papaparse.min.js');

const Maindiv = styled.div`
  display: flex;
  width: 60%;
  height: 800px;
  background-color: rgba(255,255,255,.9);
  border: 3px solid #dfece6;
  flex-direction: column;
  border-radius: 7px;
  padding-left: 15px;
  padding-right: 55px;
  @media (max-width: 400px) {
    width: 300px;
    border: none;
    background-color: none;
    margin-left: 125px;
    margin-top: 50px;
  }
`
const Misc = styled.h1`
  font-size: 40px;
  margin-bottom: 0px;
  @media (max-width: 400px) {
    font-size: 35px;
  }
`
const Classdiv = styled.div`
  display: flex;
  width: 100%;
  height: 25px;
  margin-left: 25px;
  margin-bottom: 70px;

  flex-direction: column;
  justify-content: ;
`
const Namediv = styled.div`
  display: flex;
  flex-direction: row;
  width: 250px;
  height: 30px;
`

const Namediv2 = styled.div`
`
const Title = styled.h1`
  font-size: 50px;
  height: 40px;
  @media (max-width: 400px) {

    font-size: 40px;
    margin-bottom: 25px;
  }
`
const Ptag = styled.p`
  margin-top: 25px;
  margin-left: 5px;
  margin-right: 5px;
`
const Editname = styled.input`
  padding-left: 10px;
  text-decoration: none;
  width: 235px;
  height: 25px;
  border: 1px solid black;
  color: black;
  margin-top: 15px;
  margin-right: 15px;

  :: placeholder {
      color: black;
      font-family: 'Raleway', sans-serif;
  }

  @media (max-width: 400px) {
  width: 100px;
    margin-top: 50px;
    margin-right: 5px;
  }
`
const Editname1 = styled.input`
    display: block;
    padding-left: 10px;
    text-decoration: none;
    width: 235px;
    height: 25px;
    border: 1px solid black;
    color: black;
    margin-top: 15px;
    margin-left: 25px;

    :: placeholder {
        color: black;
        font-family: 'Raleway', sans-serif;
    }

    @media (max-width: 400px) {

      margin-top: 50px;
    }
`
const Sider = styled.button`
  text-decoration: none;
  background-color: none;
  border: none;
  cursor: pointer;
  height: 25px;
  background: none;
  width: 40px;
  @media (max-width: 400px) {

    margin-top: 35px;
  }
`

const Sider2= styled.button`
  margin-top: 30px;
  margin-right: 5px;
  margin-bottom: 20px;
  text-decoration: none;
  background-color: none;
  border: none;
  cursor: pointer;
  height: 25px;
  background: none;
  width: 40px;
  @media (max-width: 400px) {
  }
`
const Bigbutton = styled.button`
  font-family: 'Raleway', sans-serif;
  width: 250px;
  height: 50px;
  text-decoration: none;
  cursor: pointer;
  margin-top: 50px;
  border: none;
  background-color:#00E1F5;
  color: black;
  margin-bottom: 50px;

  transition: .4s;
  :hover {
    color: white;
  }
`
const Secondlevel = styled.div`
font-family:'Raleway', sans-serif;
  width: 100%;
  height: .1px;
  justify-content: center;
  flex-direction: row;
  justify-content: right;
`
const Dec = styled.button`
  font-family:'Raleway', sans-serif;
  margin-top: 15px;
  font-size: 16px;
  border: none;
  width: 150px;
  height: 40px;
  text-decoration: none;
  cursor: pointer;
  color: black;
  background-color: #F56600;
  transition: .5s;

  :hover {
      color: white
  }
`
const Import = styled.label`
  padding-top: 10px;
  margin-top: 15px;
  font-family:'Raleway', sans-serif;
  border: none;
  width: 150px;
  height: 30px;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  color: white;
  background-color: black;
  transition: .5s;
  margin-bottom: 15px;

    :hover {
        background-color: grey;
    }
`
const CsvStyling = styled.input`
  font-family:'Raleway', sans-serif;
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
  `

const NameGrid = styled.div`
  width: 100%;
  padding-left: 25px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(1, auto);
`
const NameItem = styled.div`
  display: flex;
  border: solid 1px pink;
  align-items: center;
  justify-content: space-between;
`

class Class extends Component {
    constructor() {
        super();
        this.state={
          class_name: 'New Class',
          studentList: [],
          lastName: '',
          firstName: '',
          alertOpen: false,
          alertTitle: '',
          resetOpen: false,
          studentList2: [],
          editOpen: false,
          newName: '',
          newLastName: '',
          editClassName: false
        }
    }

    componentDidMount() {
      if (localStorage.getItem("studentID")) {
        localStorage.removeItem("studentID")
      }
      this.loadStudents()
    }

  handleChangeFile = event => {
    const filename = event.target.files[0];
    PapaParse.parse(filename,
            {header: false, complete: (results) =>
               {
                 const unnested = [];
                 const token =localStorage.getItem('jwt').toString();
                 results.data.map( s => {unnested.push(s[0])})
                  this.setState({studentList: unnested})
                  this.setState({class_name: unnested[0]})
                  console.log("state", this.state.studentList)
                  axios.post('https://labs8randomizer.herokuapp.com/clss/csv_post', {"class_name" : this.state.class_name, "studentArray": this.state.studentList}, {
                    headers: {
                      'Authorization':'Token '.concat(token)
                    }
                  })
                  .then(res => {
                    let parsed = res.data
                    this.setState({studentList: parsed['studentArray']}, () => {
                      console.log("state in .then", this.state.studentList)
                      this.handleDisplay()
                    })
                    localStorage.setItem('classID', parsed['classID'])
                    })
                  .catch(err => {console.log(err)})
               }
             })
           };

    createClass = () => {
        if (this.state.class_name === ''){
          this.props.alert.error("Please enter a class name")
          return
        }
        else{
          this.showHandler()
        const mail = {"class_name": this.state.class_name};
        const token =localStorage.getItem('jwt').toString();
        console.log('token type', typeof token)
        axios
          .post('https://labs8randomizer.herokuapp.com/clss/create_class', {"class_name": this.state.class_name}, {
              headers: {
            'Authorization':'Token '.concat(token)

        }})
          .then(res => {
            localStorage.setItem('classID',res.data.id)
            console.log(res.data)
            this.handleCreateButtons()
          })
          .catch(err => {
          });
          console.log('Create')
          console.log('class',)
      }};

      addStudent = e => {
        if (this.state.firstName === ''|| this.state.lastName === ''){
          this.props.alert.error('Please enter first and last name')
          return
        }
        else {
        const mail = {"class_name": this.state.class_name}
        axios
          .post('https://labs8randomizer.herokuapp.com/clss/add_student',  {
            "classID": localStorage.getItem("classID"),
            "firstName":this.state.firstName,
            "lastName":this.state.lastName,
          })
          .then(res => {
            console.log('resdata', res.data['key'])
            console.log('studentlist', this.state.studentList)
            let fullName = `${this.state.firstName} ${this.state.lastName}`;
            console.log('fullname', fullName)
            // this.state.studentList.push({'fullName': fullName, 'studentID': res.data['studentID']})
            this.setState({studentList: [...this.state.studentList, {'fullName': `${this.state.firstName} ${this.state.lastName}`, 'studentID': res.data['key']}]},
            ()=>{this.secondDisplay()})

          })
          .catch(err => {
            console.log(err)
          });
      }};
      handleInput = e => {
        const {value} = e.target;
        this.setState({ class_name: value });
      };
      studentInput= e => {
          const {value} = e.target;
          this.setState({firstName: value})
      }
      studentInput2 = e => {
        const {value} =e.target;
        this.setState({lastName: value})
      }

  alertDialog = (dialog, title, key) => {
    this.setState({
      [dialog]: true,
      title: title,
      ind: key
    })
  }
  editDialog = (dialog, title, key) => {
    this.setState({
      [dialog]: true,
      title: title,
      ind: key
    })
  }
  closeDialog = (dialog) => {
    this.setState({
      [dialog]: false,
    })
  }
  handleClickOpen = (dialog) => {
    this.setState({ [dialog]: true });
  };
  handleClose = (dialog, ind) => {
    console.log('i want the key value', ind)
    let student = this.state.studentList[ind]
    let studentID = student['studentID']
    axios
    .delete('https://labs8randomizer.herokuapp.com/clss/deletestudent',{
    data: {"studentID": studentID.toString()}
    })
    .then( res => {
      this.state.studentList.splice(ind,1)
      this.setState({[dialog]: false, studentList: this.state.studentList, studentList2: [] },() => {
        this.handleDisplay()
      })

    })
  };
  handleEdit = (dialog, ind) => {
    console.log('index', ind)
    let student = this.state.studentList[ind]
    let studentID = student['studentID']
    if(this.state.newName || this.state.newLastName){
      axios.post('https://labs8randomizer.herokuapp.com/clss/updatestudent', {
          "student_name_first": this.state.newName,
          "student_name_last": this.state.newLastName,
          "studentID": studentID
      })
      .then(res => {
        this.state.studentList[ind]['fullName'] = `${this.state.newName} ${this.state.newLastName}`
        this.setState({[dialog]: false, newName: '', newLastName: '', studentList: this.state.studentList, studentList2: []}, () => {this.handleDisplay()})
      })
    }
  }
  handleNewName = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  handleDisplay = e => {
    this.setState({studentList2: []})
    for (let i = 0; i < this.state.studentList.length; i++){
      let s = this.state.studentList[i]
      let t = s['fullName']
    console.log('t', t)
      this.state.studentList2.push(
        <NameItem key={i}>
         <Deleteicon onClick={() => this.alertDialog('alertOpen', `${t}`, i)}/> {t}
           <Button style={{width: '45%'}} color="primary" onClick={() => this.alertDialog('editOpen', `${t}`, i)}>
             Edit Name
           </Button>
         </NameItem> )
      this.setState({studentList2: this.state.studentList2}, ()=>{
        this.showHandler()
      })
    }

  }
  secondDisplay = e => {
    let inc = this.state.studentList.length -1
    for (let i = inc; i < this.state.studentList.length; i++){
    console.log('test', i)
    let s = this.state.studentList[i]
    console.log('s', s)
    // this.state.studentList2.push(<NameItem key={i}> <Deleteicon onClick={() => this.alertDialog('alertOpen', `${this.state.studentList[i]['fullName']}`)}/> {this.state.studentList[i]['fullName']} </NameItem>)
    this.setState({studentList2:[...this.state.studentList2,
      <NameItem key={i}>
       <Deleteicon onClick={() => this.alertDialog('alertOpen', `${this.state.studentList[i]['fullName']}`, i)}/> {this.state.studentList[i]['fullName']}
         <Button style={{marginTop: 'auto', width: '45%'}} color="primary" onClick={() => this.alertDialog('editOpen', `${this.state.studentList[i]}`, i)}>
           Edit Name
         </Button>
       </NameItem> ]})

    console.log('loop state', this.state.studentList2)
    this.setState({firstName: 'First Name', lastName: 'Last Name'})
    }
  }
  loadStudents = e => {
    if(localStorage.getItem('classID')){
      axios
      .post('https://labs8randomizer.herokuapp.com/clss/list_students', {"classID": localStorage.getItem('classID')} )
      .then(res => {
        console.log('loadres', res.data)
        let son = res.data
        console.log('son', son['studentNames'])
        this.setState({class_name: son['class_name']})
        if (son['studentNames'].length > 0){
        son['studentNames'].map(name => {
          this.setState({studentList: [...this.state.studentList, name]})
        })
        console.log('sanity check', this.state.studentList)
        this.handleDisplay()
      }})
    this.handleCreateButtons()
    }
    else return
  }






  handleCreateButtons = () => {
    let a = document.getElementById('createButtons')
    if (a.style.visibility==="visible") {
      a.style.visibility ="hidden"
    }
  }
  startHandler = e => {
    this.props.history.push('/Random');
  }
  showHandler() {
  let a = document.getElementById('First');
  let b = document.getElementById("Bigbutton");
  let c = document.getElementById("Namediv2");
  let d = document.getElementById('Grid')
  console.log('a', a)

  if (a.style.visibility==="hidden") {
    a.style.visibility ="visible"

  }

  if (b.style.visibility==="hidden") {
    b.style.visibility ="visible"
  }
  if (c.style.visibility==="hidden") {
    c.style.visibility ="visible"
  }
  if (d.style.visibility==="hidden") {
    d.style.visibility ="visible"
  }
}
  editClassName = e => {
    axios.post('https://labs8randomizer.herokuapp.com/clss/updateclass', {
      "classID": localStorage.getItem("classID"),
      "class_name": this.state.class_name
    })
    .then( res=> {
      console.log(res.data)
    })
  }
    render() {
        return (
            <Maindiv>
              <Namediv2 id="Namediv2">
                <div style={{display: 'flex'}}>
                  <Sider2 onClick={() => {
                    this.setState({editClassName: !this.state.editClassName})
                    }}>
                    <Pencil style={{fontSize: '40px'}}></Pencil>
                  </Sider2>
                  <Misc>{this.state.class_name}</Misc>
                </div>
                {this.state.editClassName ? <Input
                                              placeholder='Enter Class Name'
                                              onChange={this.handleInput}
                                              value={this.state.class_name}
                                              style={{marginLeft: '25px', marginTop: '13px'}}
                                              endAdornment={
                                                <InputAdornment position="end">
                                                  <Save onClick={() => {
                                                      this.editClassName()
                                                      this.setState({editClassName: !this.state.editClassName})
                                                    }}/>
                                                </InputAdornment>
                                              }
                                              /> : ''}
              </Namediv2>
              <Classdiv>
                <Namediv id='createButtons' style={{visibility:'visible'}}>



                <Import htmlFor="file">Import CSV</Import>
                 <Ptag>Or</Ptag>
                <Dec onClick={() =>{
                  this.createClass()
                   } }>Create Class</Dec>



                </Namediv >
                <Namediv id="First" style={{visibility:'hidden'}}>
                  <Editname type="text" placeholder="First Name" onChange={this.studentInput} value={this.state.firstName}></Editname>
                  <Editname type="text" placeholder="Last Name" onChange={this.studentInput2}value={this.state.lastName}></Editname>
                  <Sider onClick={this.addStudent}>
                    <Addbutton style={{fontSize: '56px'}}></Addbutton>
                  </Sider>
                </Namediv>
              </Classdiv>


              <Secondlevel id="SecondLevel">





                <CsvStyling type='file' id="file" accept="text/csv" onChange={e => this.handleChangeFile(e)}/>
              </Secondlevel>
              <NameGrid id="Grid" style={{visibility:'hidden'}}>
                {this.state.studentList2}
              </NameGrid>
              <Namediv id="Bigbutton" style={{visibility:'hidden'}}>
                <Bigbutton onClick={this.startHandler}>Start Randomizer</Bigbutton>
              </Namediv>
              <AlertDialog open={this.state.alertOpen} title={this.state.title} ind={this.state.ind} handleClose={() => this.handleClose('alertOpen', this.state.ind)} handleClickOpen={() => this.handleClickOpen('alertOpen')} closeDialog={() => this.closeDialog('alertOpen')}/>
              <EditDialog newLastName={this.state.newLastName}  ind={this.state.ind} newName={this.state.newName} open={this.state.editOpen} title={this.state.title} editClose={() => this.handleEdit('editOpen', this.state.ind)} handleClickOpen={() => this.handleClickOpen('editOpen')} handleNewName={this.handleNewName} handleClose={() => this.closeDialog('editOpen')}  />
            </Maindiv>
        )
    }
}
export default withAlert(Class);

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";


const baseurl = "http://127.0.0.1:5000";
//const baseurl = "http://192.168.1.19:5000";

class App extends Component {
    constructor(props) {
        super(props);
  
        // Setting up state
        this.state = {
            userInput: "",
            list: [],
        };
    }

    componentDidMount = () => {
      this.updateToDoList();
    } 
  
    // Set a user input value
    updateInput(value) {
        this.setState({
            userInput: value,
        });
    }
 
    updateToDoList(){
	  fetch(baseurl+"/request")
	    .then((response) => response.json())
	    .then(json => this.setState({ userInput: this.state.userInput, list: json.res }));
    }
 
    // Add item if user input in not empty
    addItem() {
        if (this.state.userInput !== "") {
	
	    var newTask = this.state.userInput;
	    //add through api
	    fetch(baseurl+"/request",
	     { 
		method: 'POST',
		body: JSON.stringify( { "task" : newTask }),
		headers: {
         	  "Content-type": "application/json; charset=UTF-8",
      		} 
	     })
	     .then(() => this.updateToDoList())
         .then(() => {
            var list = this.state.list;
            this.setState({
                userInput: "",
                list
            })
         })
        }
    }
  
    // Function to delete item from list use id to delete
    deleteItem(key) {
        fetch(baseurl+"/request/"+key,{
            method: 'DELETE',
        })
        .then(() => this.updateToDoList())
        .then(() => {
            var list = this.state.list;
            this.setState({
                userInput: "",
                list
            })
        })
    }
  
    editItem = (key) => {
      const editedTodo = prompt('Edit the todo:');
      if (editedTodo !== null && editedTodo.trim() !== '') {
        fetch(baseurl+"/request",{
            method: 'PUT',
            body: JSON.stringify({ "id" : key, "task" : editedTodo }),
		    headers: {
         	  "Content-type": "application/json; charset=UTF-8",
      		} 
        })
        .then(() => this.updateToDoList())
        .then(() => {
            var list = this.state.list;
            this.setState({
                userInput: "",
                list
            })
        })
      }
    }

	render() {
        return (
            <Container>
                <Row
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "3rem",
                        fontWeight: "bolder",
                    }}
                >
                    TODO LIST
                </Row>
  
                <hr />
                <Row>
                    <Col md={{ span: 5, offset: 4 }}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="add item . . . "
                                size="lg"
                                value={this.state.userInput}
                                onChange={(item) =>
                                    this.updateInput(item.target.value)
                                }
                                aria-label="add something"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup>
                                <Button
                                    variant="dark"
                                    className="mt-2"
                                    onClick={() => this.addItem()}
                                >
                                    ADD
                                </Button>
                            </InputGroup>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 5, offset: 4 }}>
                        <ListGroup>
                            {/* map over and print items */}
                            {this.state.list.map((item, index) => {
                                return (
                                  <div key = {index} > 
                                    <ListGroup.Item
                                        variant="dark"
                                        action
                                        style={{display:"flex",
                                                justifyContent:'space-between'
                                      }}
                                    >
                                        {item.task}
                                        <span>
                                        <Button style={{marginRight:"10px"}}
                                        variant = "light"
                                        onClick={() => this.deleteItem(item.id)}>
                                          Delete
                                        </Button>
                                        <Button variant = "light"
                                        onClick={() => this.editItem(item.id)}>
                                          Edit
                                        </Button>
                                        </span>
                                    </ListGroup.Item>
                                  </div>
                                );
                            })}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}
  
export default App;

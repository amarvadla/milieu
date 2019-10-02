import React, { Component } from 'react'
import {Form , Button} from 'react-bootstrap'

class SignUp extends Component {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);

        fetch('/api/form-submit-url', {
            method: 'POST',
            body: data
        });
    }

    render() {
        return (<div>
            {/* <form onSubmit={this.handleSubmit}>
                <label htmlFor="firstname">Enter FirstName</label>
                <input type="text" id="firstname" name="firstname"></input>

                <label htmlFor="lastname">Enter LastName</label>
                <input type="text" id="lastname" name="lastname"></input>

                <label htmlFor="email">Enter email/mobile</label>
                <input type="text" id="email" name="email"></input>

                <label htmlFor="gender">Enter Gender</label>
                <input type="text" id="gender" name="gender"></input>

                <label htmlFor="birthday">Enter Birth day</label>
                <input type="text" id="birthday" name="birthday"></input>

                <label htmlFor="password">chooswe password</label>
                <input type="text" id="password" name="password"></input>

                <button>submit</button>
            </form> */}

            <Form>
                <Form.Group controlId="formBasicfname">
                    <Form.Label>Enter FirstName</Form.Label>
                    <Form.Control type="text" size="sm"placeholder="Enter FirstName" />
                </Form.Group>

                <Form.Group controlId="formBasiclname">
                    <Form.Label>Enter LastName</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="Enter LastName" />
                </Form.Group>
                
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Enter Email</Form.Label>
                    <Form.Control type="email" size="sm" placeholder="Enter Email" />
                </Form.Group>

                <Form.Group controlId="formBasicGender">
                    <Form.Label>Enter Gender</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="Enter Gender" />
                </Form.Group>

                <Form.Group controlId="formBasicDob">
                    <Form.Label>Enter Birth Day</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="Enter Birth Day" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>)
    }
}

export default SignUp
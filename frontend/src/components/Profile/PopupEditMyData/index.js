import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import "./style.css";



//===============================================================


import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/reducers/profile/index";

//=================================================================

const Popup_Edit_Data = (props) => {

    //===============================================================

    const dispatch = useDispatch();

    //===============================================================

    let user_test = {
        first_name: undefined,
        last_name: undefined,
        age: undefined,
        country: undefined,
        email: undefined,
        password: undefined,
    }
    const [userDataHolder, setUserDataHolder] = useState(user_test)

    //===================================================




    const handleChange = (e) => {
        const { name, value } = e.target
        setUserDataHolder((preData) => ({ ...preData, [name]: value }))
        console.log(userDataHolder);
    }


    const submitNewData = () => {
        axios.put(`${process.env.REACT_APP_BACKEND}/users/${localStorage.getItem("userId")}`, userDataHolder, {
            headers: {
                'Authorization': `${localStorage.getItem("userId")}`
            }
        })
            .then(function (response) {
                // userData
                console.log(response.data.user, "my data")
                dispatch(setUserData(response.data.user))
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (

        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit My profile Data
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>


                <form onSubmit={(event) => event.preventDefault()} className="myProfileAreaEdit">
                    <label htmlFor="first_name" >first_name: </label>
                    <Form.Control name="first_name" placeholder="your first_name" onChange={handleChange} />
                    <label htmlFor="last_name" >last_name:</label>
                    <Form.Control name="last_name" placeholder="your last_name" onChange={handleChange} />
                    <label htmlFor="age" >age:</label>
                    <Form.Control name="age" placeholder="your age" onChange={handleChange} />
                    <label htmlFor="age" >country:</label>
                    <Form.Control name="country" placeholder="your country" onChange={handleChange} />
                    <label htmlFor="email" >email:</label>
                    <Form.Control name="email" placeholder="your email" onChange={handleChange} />
                    <label htmlFor="password" >password:</label>
                    <Form.Control name="password" type="password" placeholder="your password" onChange={handleChange} />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <div className='submitNewButton' >
                    <Button className="shadowButton" onClick={submitNewData}>submit</Button>
                </div>
                <Button className="shadowButton" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Popup_Edit_Data



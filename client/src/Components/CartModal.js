import React, {useState,useEffect, useRef} from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/esm/Button';
import { fabric } from 'fabric';

export const CartModal = (props) => {
    const [checkout, setCheckout] = useState(false)
    const [canvas, setCanvas] = useState()

    const canvasRef = useRef();

    console.log(props.cartItems[0])


    const placeOrder = (data) => {
        console.log('Placing order', data)

        fetch('/add-order',
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: {
                            force_verified_delivery: true,
                            city: 'Orlando',
                            country: 'United States',
                            phone: '5712138194',
                            state: 'FL',
                            street1: '2114 N Westmoreland Dr',
                            zip: '32804',
                            first_name: 'Laura',
                            last_name: 'Holloway',
                            skip_verification: false
                        },
                        line_items: [{
                            print_areas: [
                                {
                                    key: 'front',
                                    url: 'https://cdn.discordapp.com/attachments/1117536753012703295/1133113793237491762/Digital_Brew_circuits_and_tech_e7b37ebd-ba73-424a-bc97-01538c0e7969.png'
                                }
                            ],
                            quantity: 1,
                            product_variant: 38477384
                        }]
                    })
            })
        .then(res => res.json())
        .then(result => {
            console.log('Order Result', result)
        })
    }

    const priceTotal = props.cartItems.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.variant.price);
                }, 0);

    // useEffect(() => {
    //     const json = JSON.stringify(props.cartItems[0].mock);
    //     const canvas = new fabric.Canvas(canvasRef.current, {
    //         height: 180,
    //         width: 180,
    //     })
        
    //     canvas.loadFromJSON(json, canvas.renderAll.bind(canvas))
    //     canvas.setZoom(0.5);
    //     setCanvas(canvas)
    // }, [props.cartItems])

    

    return (
        <>

        <Modal {...props} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
            <Modal.Header closeButton />
            <Modal.Body>
                <div className='cart-modal'>
                    {
                        checkout ? 
                        <Form className='Address'>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridFName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control placeholder="Enter first name" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control placeholder="Enter last name" />
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control placeholder="1234 Main St" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formGridAddress2">
                                <Form.Label>Address 2</Form.Label>
                                <Form.Control placeholder="Apartment, studio, or floor" />
                            </Form.Group>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State</Form.Label>
                                <Form.Select defaultValue="Choose...">
                                    <option>Choose...</option>
                                    <option>FL</option>
                                </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control />
                                </Form.Group>
                            </Row>

                            <Button variant="primary" type="submit" onClick={placeOrder}>Check out</Button>
                        </Form>
                        :
                        null
                    }
                    <div className='products'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Size</th>
                                    <th>Color</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                    
                                    {props.cartItems.map((item, index) => {
                                            console.log(item)

                                            const json = JSON.stringify(item.mock);
                                            const canvas = new fabric.Canvas('myCanvas' + index, {
                                                height: 180,
                                                width: 180,
                                            })
                                            
                                            canvas.loadFromJSON(json, canvas.renderAll.bind(canvas))
                                            canvas.setZoom(0.5);
                                            // setCanvas(canvas)

                                            return (
                                                <>
                                                <tr>
                                                    <td><canvas id={'myCanvas' + index} /></td>
                                                    <td><h3>{item.product.name}</h3></td> 
                                                    <td>{item.variant.price}</td>
                                                    <td>{item.variant.size.name}</td>
                                                    <td>{item.variant.color.name}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                </>
                                            )
                                        })
                                    }
                                
                            </tbody>
                        </Table>
                    </div>
                </div>



                <div>
                    <h2>Total: ${priceTotal}</h2>
                    <p></p>
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button className='my-btn' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>

        </>
    )
}
import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { fabric } from 'fabric';

export const ProductModal = (props) => {
    const [selectedSize, setSelectedSize] = useState('Select Size')
    const [selectedSizeId, setSelectedSizeId] = useState()
    const [selectedColorID, setSelectedColorId] = useState()
    const [canvas, setCanvas] = useState('')
    const [mockup, setmockup] = useState('')
    const [myScaleToHeight, setMyScaleToHeight] = useState()
    const [myCropX, setMyCropX] = useState()
    const [myWidth, setMyWidth] = useState()
    const [myTop, setMyTop] = useState()
    const [myLeft, setMyLeft] = useState()
    const [colors, setColors] = useState()
    const [sizes, setSizes] = useState()
    const [backorder, setBackorder] = useState([])
    const [cartAlert, setCartAlert] = useState(false)

    const canvasRef = useRef();

    const handleSelect = (data) => {
        const result = data.split(',')
        setSelectedSize(result[0])
        setSelectedSizeId(result[1])
    }

    const highlight = (e, name) => {
        const prodMocks = props.product.mockups
        
        if(document.querySelector('.active')) {
            document.querySelector('.active').classList.remove('active')
        }

        document.getElementById(e).classList.add('active');
        setSelectedColorId(e)

        prodMocks.forEach(image => {
            if(image.product_variants[0].name.includes(name) && image.print_areas[0].key === 'front') {
                setmockup(image.url)
            }
        })
    }

    const sendToCart = (prod) => {
        if(selectedColorID === undefined || selectedSizeId === undefined) {
            document.getElementById('cart-warning').classList.add('show');
            setCartAlert(true)
        } else {
            const variants = prod.product_variants;
            var result = variants.filter(obj => {
                return obj.color.id === selectedColorID && obj.size.id === parseInt(selectedSizeId)
            })
            props.addtocart({'product':prod, 'variant': result[0], 'image': props.finalimage})
        }
    }

    useEffect(() => {
        const mockSizes = [
            {   'product': 5723107,
                'scaleToHeight': 161,
                'cropX': 85,
                'width': 890,
                'top': 89,
                'left': 117.7
            },
            {   'product': 5723108,
                'scaleToHeight': 142,
                'cropX': 85,
                'width': 897,
                'top': 96,
                'left': 125
            },
            {   'product': 5723105,
                'scaleToHeight': 160,
                'cropX': 85,
                'width': 880,
                'top': 109,
                'left': 121
            },
            {   'product': 5723106,
                'scaleToHeight': 97,
                'cropX': 0,
                'width': 1010,
                'top': 133,
                'left': 143.8
            },
        ]

        const prodMocks = props.product.mockups
        prodMocks.forEach(image => {
            if(image.product_variants[0].name.includes('White') && image.print_areas[0].key === 'front') {
                setmockup(image.url)
            }
        })
        mockSizes.forEach(obj => {
            if(obj.product === props.product.id) {
                setMyScaleToHeight(obj.scaleToHeight)
                setMyCropX(obj.cropX)
                setMyWidth(obj.width)
                setMyTop(obj.top)
                setMyLeft(obj.left)
            }
        })
    }, [props.product.mockups,props.product.id])

    useEffect(() => {
        if(mockup !== '') {
            let canvas = new fabric.Canvas(canvasRef.current, {
                height: 380,
                width: 380,
            })
            
            fabric.Image.fromURL(mockup, (imgObj) => {
                imgObj.scale(0.185);
                imgObj.selectable = false;
                imgObj.transparentCorners = false;
                canvas.add(imgObj).renderAll();
            })

            fabric.Image.fromURL(props.finalimage, (imgObj) => {
                imgObj.selectable = false;
                imgObj.scaleToHeight(myScaleToHeight)
                imgObj.set({
                    cropX: myCropX,
                    width: myWidth,
                    top: myTop,
                    left: myLeft,
                    opacity: 0.5,
                });
                canvas.bringToFront(imgObj)
                canvas.add(imgObj).renderAll();
            })

            setCanvas(canvas)
        }
    }, [mockup, myCropX, myLeft, myScaleToHeight, myTop, myWidth, props.finalimage])

    useEffect(() => {
        const variants = props.product.product_variants;
        const backoder = variants.filter(obj => {
            return obj.availability === 'backorder'
        })
        setBackorder(backoder)
        setColors(props.product.colors)
        setSizes(props.product.sizes)
    }, [])

    useEffect(() => {
        if(cartAlert && selectedColorID !== undefined && selectedSizeId !== undefined) {
            document.getElementById('cart-warning').classList.remove('show');
            setCartAlert(false)
        }
    }, [selectedColorID, selectedSizeId, cartAlert])
    
    return (
        <Modal {...props} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
            <Modal.Header closeButton />
            <Modal.Body>
                <div className='product-modal'>
                    <div className='modal-img'>
                        <div className='canvas-wrapper'>
                            <canvas ref={canvasRef} id='myCanvas' />
                        </div>
                    </div>
                    
                    <div className='modal-info'>
                        <h2>{props.product.item.name}</h2>

                        <div dangerouslySetInnerHTML={{__html: props.product.description}}/>

                        <h4>Colors</h4>
                        <div className='colors'>
                            {props.product.colors.map(data => {
                                if(typeof selectedSizeId !== 'undefined') {
                                    if(backorder.some(item => item.size.id === parseInt(selectedSizeId) && item.color.id === data.id)) {
                                        return (
                                            <Form.Check disabled type='radio' name='color-select' className='color' id={data.id} style={{backgroundColor: '#'+data.primary_hex}}  onClick={() => {highlight(data.id, data.name) }} key={data.id}></Form.Check>
                                            )
                                    } else {
                                        return (<Form.Check type='radio' name='color-select' className='color' id={data.id} style={{backgroundColor: '#'+data.primary_hex}}  onClick={() => {highlight(data.id, data.name) }} key={data.id}></Form.Check>)
                                    }
                                }
                                return (<Form.Check type='radio' name='color-select' className='color' id={data.id} style={{backgroundColor: '#'+data.primary_hex}}  onClick={() => {highlight(data.id, data.name) }} key={data.id}></Form.Check>)
                            })}
                            
                        </div>
                        <Dropdown className='sizes' onSelect={handleSelect}>
                            <DropdownButton title={selectedSize}>
                                {props.product.sizes.map(data => {
                                    if(typeof selectedColorID !== 'undefined') {
                                        if(backorder.some(item => item.color.id === selectedColorID && item.size.id === data.id)) {
                                            return (<Dropdown.Item className='size disabled' id={data.id} key={data.id} eventKey={[data.name, data.id]}>{data.name}</Dropdown.Item>)
                                        } else {
                                            return (<Dropdown.Item className='size' id={data.id} key={data.id} eventKey={[data.name, data.id]}>{data.name}</Dropdown.Item>)
                                        }
                                    } else {
                                        return (<Dropdown.Item className='size' id={data.id} key={data.id} eventKey={[data.name, data.id]}>{data.name}</Dropdown.Item>)
                                    }
                                })}
                            </DropdownButton>
                        </Dropdown>
                        
                        <h3>${props.product.product_variants[0].price}</h3>
                        <div id='cart-warning' className='empty-cart'>
                            <Alert key='warning' variant='warning'>
                                Select color AND size!
                            </Alert>
                        </div>
                        
                        
                        <div>
                            <Button className='my-btn' onClick={() => sendToCart(props.product)}>Add to cart</Button>
                        </div>
                    </div>
                    
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button className='my-btn' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

    // todo: Check for in_stock items
    // todo: Link items to their product variation id to avoid stock issues
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ProductModal } from './ProductModal';
import { CartModal } from './CartModal';

export const HomePage = () => {
    const [cartItems, setCartItems] = useState([])
    const [modalShow, setModalShow] = useState(false);
    const [modalProd, setModalProd] = useState({});
    const [lgShow, setLgShow] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [promptRes, setPromptRes] = useState({});
    const [finalImage, setFinalImage] = useState('')
    const [productsInfo, setProductsInfo] = useState([]);
    const productTemplates = [23958, 24257, 24259];
    const noImgProduct = [5723108, 5723107, 5723106, 5723105]
    const [letSpin, setLetSpin] = useState(false);
    const [submitBtn, setSubmitBtn] = useState('Submit')

    const handleSubmit = (e) => {
        if(hasImage) {
            setHasImage(false);
            setPromptRes({});
        }
        setLetSpin(true)
        setSubmitBtn('Generating Image')
        e.preventDefault();
        const formData = new FormData(e.target);        
        const formJson = Object.fromEntries(formData.entries());
        const formPrompt = Object.values(formJson);
        fetch('/midjourney',
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formPrompt)
            })
        .then(res => res.json())
        .then(result => {
            setLetSpin(false)
            setSubmitBtn('Try something new')
            setPromptRes(result.Imagine)
            setHasImage(true);
            
        })
    };

    const handleImage = (e) => {
        if(e.target.textContent[0] === 'U') {
            setLetSpin(true)
            fetch('/upscale',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    index: parseInt(e.target.textContent[1]),
                    id: promptRes.id, 
                    hash: promptRes.hash, 
                    flags: promptRes.flags, 
                    content: promptRes.content 
                })
            })
            .then(res => res.json())
            .then(json => {
                setLetSpin(false)
                setPromptRes(json.Upscale)
                setHasImage(true);
                setFinalImage(json.Upscale.uri)
                getProducts(noImgProduct).then(data => setProductsInfo(data))
            })
        }
    }

    const getProducts = async (data) => {
        
        const response = data.map(item => fetch('/product/' + item,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        )
        return Promise.all(response)
    }

    useEffect(() => {
        console.log('Cart Items ', cartItems)
    })
    
    const addtocart = (item) => {
        const isInArray = cartItems.some(obj => obj.id === item.id)
        if(cartItems.length >= 1 && isInArray) {
            let el =
            cartItems.map(obj => {
                if(obj.id === item.id) {
                    obj.quantity = obj.quantity + 1
                }
                return obj
            })
            setCartItems(el)
        } else {
            setCartItems((currentObject) => [...currentObject, item])
        }
    }

    const removefromcart = (item) => {
        console.log(item)
        setCartItems((currentObject) => currentObject.filter(obj => obj.id !== item))
    }

    const minus = (item) => {
        console.log('Minus', item)
        let el =
        cartItems.map(obj => {
            if(obj.id === item && obj.quantity > 1) {
                
                obj.quantity = obj.quantity - 1
            }
            return obj
        })
        console.log('Element ', el)
            setCartItems(el)
    }

    const plus = (item) => {
        console.log('Plus', item)
        let el =
        cartItems.map(obj => {
            if(obj.id === item) {
                
                obj.quantity = obj.quantity +1
            }
            return obj
        })
        console.log('Element ', el)
            setCartItems(el)
    }

    return (
        <>
        <div className='nav'>
            <Button className='my-btn cart' onClick={() => { setLgShow(true)}}>
                <img src={require('../Image/cart.png')} alt='cart' /> 
                <span id="cart-count">{cartItems.length}</span>
            </Button>
        </div>
        
        <div className='prompt-body'>
            <div className='prompt-form'>
                <form onSubmit={handleSubmit} method='POST'>
                    <label>
                        Input your prompt: <textarea className='prompt' name='prompt' defaultValue='' />
                    </label>
                    <Button className='my-btn' type='submit'>{submitBtn}</Button>
                </form>
            </div>
            {letSpin ? (
                <div className='spin'>
                    <Spinner animation="border" />
                </div>
            ) : 
            null}
            
            {hasImage ? (
                <div className='prompt-result'>
                    <img src={promptRes.uri} alt='' />
                    <div className='final-buttons'>
                        {promptRes.options.map(option => {
                            if (option.label === 'U1' ||  option.label === 'U2' || option.label === 'U3' || option.label === 'U4') {
                                return <Button className='my-btn' type='button' key={option.label} onClick={handleImage}>{option.label}</Button>
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </div>
            ) : (
                null
            )}
        </div>
        {productsInfo ? (
            <div className='products-results'>
            {productsInfo.map(prod => {
                if (prod.mockups.length !== 0) {
                    return (
                        <div className='product-display' key={prod.id}>
                            {prod.mockups.map(image => {
                                if(image.product_variants[0].name.includes('White') && image.print_areas[0].key === 'front') {
                                    return (<img src={image.url} key={image.id} alt='' />)
                                }
                            })}
                            <h3>{prod.item.name}</h3>
                            <h4>${prod.product_variants[0].price}</h4>

                            <div className='colors'>
                                {prod.colors.map(data => {
                                    return (<div className='color' style={{backgroundColor: '#'+data.primary_hex}} key={data.id}></div>)
                                })}
                            </div>

                            <div className='sizes'>
                                {prod.sizes.map(data => {
                                    return (<div className='size' key={data.id}>{data.name}</div>)
                                })}
                            </div>
                            <Button className='my-btn' onClick={() => { setModalShow(true); setModalProd(prod) }}>See your creation</Button>
                            
                        </div>
                    )
                } else {
                    return null;
                }
            })}

            {modalShow && (
                <ProductModal show={modalShow} onHide={() => setModalShow(false)} addtocart={addtocart} product={modalProd} finalimage={finalImage}/>
            )}
        </div>
        ) : (
            null
        )}

        
        {lgShow && (
            <CartModal show={lgShow} onHide={() => setLgShow(false)} removefromcart={removefromcart} minus={minus} plus={plus}  cartItems={cartItems}/>
        )}
        </>
    )
}
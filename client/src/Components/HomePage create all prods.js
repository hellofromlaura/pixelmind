import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ProductModal } from './ProductModal';
import { CartModal } from './CartModal';

export const HomePage = () => {
    const [cartItems, setCartItems] = useState([])
    const [modalShow, setModalShow] = useState(false);
    const [modalProd, setModalProd] = useState({});
    const [lgShow, setLgShow] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const [promptRes, setPromptRes] = useState({});
    const [finalImage, setFinalImage] = useState('')
    const [products, setProducts] = useState([]);
    const [hasProducts, setHasProducts] = useState(false);
    const [productsInfo, setProductsInfo] = useState([]);
    const productTemplates = [23958, 24257, 24259];
    const noImgProduct = [5723108, 5723107, 5723106, 5723105]
    

    const limit = (string) => {  
        return string.substring(0, 80).replace(/[^a-zA-Z0-9 ]/g, '')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);        
        const formJson = Object.fromEntries(formData.entries());
        const formPrompt = Object.values(formJson);
        setPrompt(formPrompt);
        fetch('/midjourney',
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formPrompt)
            })
        .then(res => res.json())
        .then(result => {
            setPromptRes(result.Imagine)
            setHasImage(true);
        })
    };

    const handleImage = (e) => {
        if(e.target.textContent[0] === 'U') {
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
                setPromptRes(json.Upscale)
                setHasImage(true);
                setFinalImage(json.Upscale.uri)
            })
        }
    }

    const getProducts = async (data) => {
        await Promise.all(
            data.map(async (prod) => {
                const response = await fetch('/product/' + prod,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const productRes = await response.json()
                await setProductsInfo(current => [...current, productRes]);
            })
        )
        .then(() => {
            setHasProducts(true)
        })
    }

    const handleFetch = async () => {
        let newProducts = []
        await Promise.all(
            productTemplates.map(async (product) => {
                const response = await fetch('/add-products',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: limit(prompt[0]),
                        print_areas: [
                            {
                                key: "front",
                                url: finalImage
                            }],
                        template: product
                    })
                })
                const productRes = await response.json()
                await newProducts.push(productRes.id)
            })
        )
        .then(() => {
            setProducts(current => [...current, ...newProducts])
        })
    }

    useEffect(() => {
        if(finalImage !== '') {
            handleFetch();
        }
    }, [finalImage]);

    useEffect(() => {
        if(products.length === productTemplates.length) {
            console.log('Creating Products')
            
            const timer = setTimeout(() => {
                console.log('Getting Products')
                getProducts(products)
                
            }, 90000)
            return () => clearTimeout(timer)
        }
    }, [products]);

    const addToCart = (item) => {
        console.log('Add to cart item ', item)
        setCartItems([item])
    }

    return (
        <>
        <Button className='my-btn' onClick={() => { setLgShow(true)}}>Cart {cartItems.length}</Button>
        <div className='prompt-body'>
            <div className='prompt-form'>
                <form onSubmit={handleSubmit} method='POST'>
                    <label>
                        Input your prompt: <textarea className='prompt' name='prompt' defaultValue='' />
                    </label>
                    <Button className='my-btn' type='submit'>Submit</Button>
                </form>
            </div>
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
        <div className='products-results'>
            {productsInfo.map(prod => {
                if (prod.mockups !== []) {
                    return (
                        <div className='product-display' key={prod.id}>
                            <img src={prod.mockups[0].url} alt='' />
                            <h3>{prod.item.name}</h3>
                            <h4>${prod.product_variants[0].price}</h4>

                            <div className='colors'>
                                {prod.colors.map(data => {
                                    return (<div className='color' style={{backgroundColor: data.name}} key={data.id}></div>)
                                })}
                            </div>

                            <div className='sizes'>
                                {prod.sizes.map(data => {
                                    return (<div className='size' key={data.id}>{data.name}</div>)
                                })}
                            </div>
                            <Button className='my-btn' onClick={() => { setModalShow(true); setModalProd(prod) }}>Buy</Button>
                            
                        </div>
                    )
                } else {
                    return null;
                }
            })}
            {lgShow && (
                <CartModal show={lgShow} onHide={() => setLgShow(false)} cartItems={cartItems}/>
            )}
            {modalShow && (
                <ProductModal show={modalShow} onHide={() => setModalShow(false)} addToCart={addToCart} product={modalProd}/>
            )}
        </div>
        </>
    )
}

//todo: setup webhooks for when products are created
//todo: fix useEffect
//todo: add quantity option to product order
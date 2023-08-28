import fetch from 'node-fetch';
import { Router } from 'express';
import "dotenv/config.js";
export const productRouter = Router();

let dsURL = 'https://api.dreamship.com/v1/';

// add product
const addProduct = (req, res) => {
    try {   
        const info = req.body
        const request = 'products/';
        const product = {
                            "name": info.name,
                            "print_areas": [
                            {
                                "key": "front",
                                "rotate": 0,
                                "url": info.print_areas[0].url
                            }
                            ],
                            "product_template": info.template,
                        }
        fetch(dsURL+request, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: [
                ['Authorization', `Bearer ${process.env.DS_TOKEN}`],
                ['Accept', 'application/json'], 
                ['Content-Type', 'application/json']
            ]
        })
        .then(res => res.json())
        .then(json => {
            res.send(json)
        })
    } catch (err) {
        console.error('Could not add product to dreamship ', err.message);
    }
};

// get product
export const getProduct = (req, res) => {
    try {   
        const request = 'products';
        const id = req.params.id;
        fetch(dsURL+request+'/'+id, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.DS_TOKEN}`,
            }
        })
        .then(res => res.json())
        .then(json => res.send(json))
    } catch (err) {
        console.error('Could not get product from dreamship ', err.message);
    }
};

//add orders
export const addOrders = (req, res) => {
    try {   
        console.log(req.body)
        console.log('------------------------------------------------------------------------------------------')
        console.log('------------------------------------------------------------------------------------------')
        console.log('------------------------------------------------------------------------------------------')
        const request = 'orders';
    //     const body = {
    //         body: JSON.stringify({
    //             address: {
    //                 force_verified_delivery: true,
    //                 city: 'Orlando',
    //                 country: 'United States',
    //                 phone: '5712138194',
    //                 state: 'FL',
    //                 street1: '2114 N Westmoreland Dr',
    //                 zip: '32804',
    //                 first_name: 'Laura',
    //                 last_name: 'Holloway',
    //                 skip_verification: false
    //             },
    //             line_items: [{
    //                 print_areas: [
    //                     {
    //                         key: 'front',
    //                         url: 'https://cdn.discordapp.com/attachments/1117536753012703295/1133113793237491762/Digital_Brew_circuits_and_tech_e7b37ebd-ba73-424a-bc97-01538c0e7969.png'
    //                     }
    //                 ],
    //                 quantity: 1,
    //                 product_variant: 38477384
    //             }],
    //             test_order: true
    //         })
    // };

    
        // fetch(dsURL+request, {
        //     method: 'POST',
        //     body: JSON.stringify(body),
        //     headers: [
        //         ['Authorization', `Bearer ${process.env.DS_TOKEN}`],
        //         ['Accept', 'application/json'], 
        //         ['Content-Type', 'application/json']
        //     ]
        // })
        // .then(res => res.json())
        // .then(json => {
        //     res.send(json)
        // })
    } catch (err) {
        console.error(err.message);
    }
};

productRouter.post('/add-products', addProduct);
productRouter.get('/product/:id', getProduct);
productRouter.post('/add-order', addOrders);

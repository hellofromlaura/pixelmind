import "dotenv/config.js";
import { Midjourney } from "midjourney";
import { Router } from 'express';

export const router = Router();

const client = new Midjourney({
    ServerId: process.env.SERVER_ID,
    ChannelId: process.env.CHANNEL_ID,
    SalaiToken: process.env.SALAI_TOKEN,
    // Debug: true,
    // Ws: true,
});

const getMidjourney = async (req, res) => {
    try {
        const prompt = req.body[0];
        await client.Connect();
        await client.Relax();
        const Imagine = await client.Imagine(prompt, (uri, progress) => {
            console.log("Imagine", uri, "progress", progress);
        });
        res.json({ Imagine });
    } catch (err) {
        console.error(err.message);
    }
}

const getVariation = async (req, res) => {
    try {
        await client.Connect();
        const Variation = await client.Variation({
            index: 3,
            msgId: "1124806989705384000", //Imagine.id,
            hash: "2b9e3cfe-ee2b-4683-bd5e-49b1ec9c9ac1", //Imagine.hash,
            flags: 0, //Imagine.flags,
            content: "**Something spooky but cute** - <@1100764215532339310> (relaxed)", //msg.content,
            loading: (uri, progress) => {
                console.log("Variation.loading", uri, "progress", progress);
            },
        })
        res.json({ Variation });
    } catch (err) {
        console.log(err.message);
    }
}

const getUpscale = async (req, res) => {
    try {
        const prompt = req.body;
        await client.Connect();
        // await client.Relax();
        const Upscale = await client.Upscale({

            index: prompt.index,
            msgId: prompt.id,
            hash: prompt.hash,
            flags: prompt.flags,
            content: prompt.content,
            loading: (uri, progress) => {
                console.log("Variation.loading", uri, "progress", progress);
            },
        })
        res.json({ Upscale });
    } catch (err) {
        console.log(err.message);
    }
}

router.post('/midjourney', getMidjourney);
router.post('/variation', getVariation);
router.post('/upscale', getUpscale);

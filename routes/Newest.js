/*
--
Initial
--
*/
const router = require("express").Router()
const axios = require('axios').default;
const url = require('../constants/Url')
let Anime = require('../modules/Anime')

/*
--
Routes
--
*/
router.get('/', function (req, res) {
    res.status(404).json({
        message: "Please add the page number",
    });
})

router.get('/:page', async (req, res) => {
    let page = req.params.page

    let fullUrl = url.baseURL + url.NEWEST_ENDPOINT + page

    //TODO: Please refactor this pagination to a modular one.
    let nextUrl = ''
    let prevUrl = ''
    if (page === '1'){
        next = parseInt(page) + 1
        nextUrl = req.protocol + '://' + req.get('host') + '/api/anime/newest/' + next
    } else {
        next = parseInt(page) + 1
        prev = parseInt(page) - 1
        nextUrl = req.protocol + '://' + req.get('host') + '/api/anime/newest/' + next
        prevUrl = req.protocol + '://' + req.get('host') + '/api/anime/newest/' + prev
    }

    try{
        let response = await axios.get(fullUrl)
        let newestAnime = new Anime(fullUrl, page, String(response.data))

        res.status(200).json({
            status: 200,
            message: 'Success',
            url: {
                source: fullUrl,
                current:  req.protocol + '://' + req.get('host') + req.originalUrl,
                next: nextUrl,
                prev: prevUrl
            },
            animeList: newestAnime.getNewestAnime()
        })
    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: '404: response not found.'
        })
    }
})

module.exports = router;
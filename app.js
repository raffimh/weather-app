const express = require('express')
const https = require("https")
const app = express()
const bodyParser = require("body-parser")
require("dotenv").config()

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    const apiKey = process.env.API_KEY
    const query = req.body.cityName
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey

    https.get(url, (response) => {
        console.log(response.statusCode)

        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.write("<p>The weather is currently " + weatherDescription + "</p>")
            res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>")
            res.write("<img src=" + imageURL + ">")
            res.send()
        })
    })
})


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
})

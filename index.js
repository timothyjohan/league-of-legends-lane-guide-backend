const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config().parsed;
const { default: axios } = require('axios');
const OpenAI = require('openai');
const openai = new OpenAI({
    key:dotenv.OPENAI_API_KEY
});



const app = express();
const port = 3666;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/api/chat', async (req, res) => {
    const {champion, my_rune, enemy, enemy_rune, lane} = req.body
    try {

        const completion = await openai.chat.completions.create({
            messages:[
                {"role": "system", "content": `I am playing as a ${champion} ${lane} using the keystone ${my_rune}, and I am fighting a ${enemy} ${lane} using the keystone ${enemy_rune}, what Is the starting item i should buy? what item do i rush? what is my first back item? what ability do i start? what do i do to win ?  provide me per level strategy until level 6. Only answer my questions, do not give additional informations unless it's crucial Check it from mobafire I know you do not have direct access to external website but just use the data you have about it`},
                
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 450
        });
        console.log(completion);
        return res.status(200).send(completion.choices[0].message.content)
        
    } catch (error) {
        return res.status(500).send(error.error)
        
    }

})

app.get('/api/champions', async (req, res) => {
    try {
        const request = await axios.get(`https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json`)
        const result = request.data.data
        let champions = []
        
        const arrReq = Object.keys(request.data.data)
        arrReq.forEach((champ)=>{
            let newChamp ={
                name: result[champ].name,
                img: `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${result[champ].image.full}`
            }
            champions.push(newChamp)
        })
        return res.status(200).send(champions)
    } catch (error) {
        return res.status(500).send(error)
        
    }
})  



app.listen(port, async ()  => { 
    console.log(`server is running on port ${port}`);
});
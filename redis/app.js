import express from 'express';
import {createClient} from 'redis';

const app = express();
const port = 3000;

const client = createClient({
    host:'127.0.0.1',
    port:6379
})

client.connect();
client.set('reload',0);
client.set('userPref',3);

app.get('/',(req,res)=>{
    client.get('reload')
    .then((reloadCount)=>{
        res.send(`Welcome , you have reload the page - ${reloadCount} times`,);
        client.set('reload',parseInt(reloadCount) +1);
    })
})

app.listen(port,()=>{
    console.log(`SERVER INIT - port ${port}`);
})

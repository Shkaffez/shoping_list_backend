const uuid = require('uuid');
const List = require('./listModel');

class Session {
    constructor(expiresAt) {
        this.expiresAt = expiresAt;
        this.userId = uuid.v4();
    }

    isExpired() {
        this.expiresAt < (new Date())
    }
}

const sessions = {};

const getHistory = async (req, res) => {
    
    if (!req.cookies) {
        console.log('no cookie')
        res.status(401).end();
        return;
    }

    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        const newSessionToken = uuid.v4();
        const now = new Date();
        const expiresAt = new Date(+now + 3600 * 1000);
        const session = new Session(expiresAt);
        sessions[newSessionToken] = session;
        console.log('из проверки, есть ли токен', sessions);


        res.cookie("session_token", newSessionToken, { expires: expiresAt });
        res.end();
    }

    if(sessionToken && sessions[sessionToken]) {
        try {
            const userId = sessions[sessionToken].userId;
            const list = await List.find({userId: userId});
            res.json(list);
        } catch (error) {
            console.log(error);
            res.send('Mongo error');
        }        
    }
}

const addToList = async (req, res) => {
    console.log("в addToList попали")
    if (!req.cookies) {
        console.log('no cookie')
        res.status(401).end();
        return;
    }

    const sessionToken = req.cookies['session_token'];
    if (!sessionToken) {
        res.status(401).end();
        return;
    }

    const { id, text, done } = req.body;
    const userId = sessions[sessionToken].userId;

    try {
        const newList = new List({
            userId, id, text, done
        });
        console.log(newList)
        await newList.save();

    } catch (error) {
        console.log(error);
        res.send('Mongo error');
    }
}

const deleteFromList = async (req, res) => {
    console.log("в deleteFromList попали")
    const { id } = req.body;
    await List.deleteOne({id: id});
    // Учесть обратную связь, если вдруг не удалось удалить
}

const togleDone = async (req, res) => {
    console.log("в togleDone попали")
    const { id, done } = req.body;
    await List.updateOne({id: id}, {done: done} )
}



module.exports = {
    getHistory,
    addToList,
    deleteFromList,
    togleDone,    
}
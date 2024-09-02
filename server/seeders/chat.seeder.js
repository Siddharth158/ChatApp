import { User } from "../models/user.models.js";
import {faker, simpleFaker} from '@faker-js/faker'
import { Chat } from "../models/chat.models.js";
import {Message} from "../models/message.models.js"

const createSampleChat = async(chatsCount)=>{
    try{
        const users = await User.find().select("_id");
        const chatsPromise = [];

        for(let i=0; i<users.length; i++){
            for(let j=i+1; j<users.length; j++){
                chatsPromise.push(
                    Chat.create({
                        name: faker.lorem.words(2),
                        members: [users[i], users[j]],
                    })
                )
            }
        }

        await Promise.all(chatsPromise);
        console.log("Chats created successfully");
        process.exit();
    } catch(error){
        console.error(error);
        process.exit(1);
    }
};

const createGroupChats = async(numChats)=>{
    try{
        const users = await User.find().select("_id");
        const chatsPromise = [];

        for(let i=0; i<numChats; i++){
            const numMembers = simpleFaker.number.int({min: 3, max: users.length});
            const members = [];

            for(let i=0; i<numMembers; i++){
                const randomIndex = Math.floor(Math.random() * users.length);
                const randomUser = users[randomIndex];

                if(!members.includes(randomUser)){
                    members.push(randomUser)
                }
            }

            const chat = Chat.create({
                groupChat: true,
                name: faker.lorem.words(1),
                members,
                creator: members[0]
            })
            chatsPromise.push(chat);
        }
        await Promise.all(chatsPromise);
        console.log("Chats created successfully");
        process.exit();
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

const createMessage = async(numMessages) =>{
    try{
        const users = await User.find().select("_id");
        const chats = await Chat.find().select("_id");

        const messagePromise = [];
        for(let i=0; i<numMessages; i++){
            const random = users[Math.floor(Math.random() * users.length)];
            const randomChat = chats[Math.floor(Math.random() * chats.length)];

            messagePromise.push(
                Message.create({
                    chat: randomChat,
                    sender: randomUser,
                    content: faker.lorem.sentence()
                })
            )
        }
        await Promise.all(messagePromise);
        console.log("Messages created successfully");
        process.exit();
    }catch(error){
        console.log(error)
        process.exit(1);
    }
}

const createMessageInChat = async(chatId, numMessages)=>{
    try {
        const users = await User.find().select("_id");
        const messagePromise=[];
        for(let i=0; i<numMessages;i++){
            const randomUser = users[Math.floor(Math.random()*users.length)];
            messagePromise.push(
                Message.create({
                    chat: chatId,
                    sender: randomUser,
                    content: faker.lorem.sentence(),
                })
            )
        }
        await Promise.all(messagePromise);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export {createGroupChats, createSampleChat, createMessage, createMessageInChat}
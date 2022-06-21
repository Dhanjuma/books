const express = require('express');
const { Router } = require('express');
const { status } = require('express/lib/response');
const uuid = require('uuid');
const fs = require('fs');
const { dirname } = require('path');


const route = express.Router();

route.get('/all_books', (req, res) => {
    let msg = 'Empty'

    fs.readFile(__dirname + '/../Book.json', (err, data) => {
      if(err){
        console.log(err);
        return;
      };
      const database = JSON.parse(data);

      if(database.length === 0)
        return res.status(200).send({status: 'ok', msg});
        res.status(200).send({status: 'ok', msg: 'sucess', database});
    })
    
})

route.get('/single_book', (req, res) => {
    const {name, author, ISBN, id} = req.body;

    if(!id)
      return res.status(400).send({status: 'error', msg: 'ID field must be entered'});

      fs.readFile(__dirname + '/../Book.json', (err, data) => {
        if(err){
          console.log(err);
          return
        }
        const database = JSON.parse(data)
        

        const [book] = database.filter((book) => {
          return book.id === id;
        })
        
        if(!book)
          return res.status(400).send({status: 'error', msg: 'Book not found'});
        res.status(200).send({status: 'ok', msg: 'Success', book});
      });
})

route.post('/upload_book', (req, res) => {
    const {name, author, ISBN} = req.body;

    if(!name || !author || !ISBN)
      return res.status(400).send({status: 'error', msg: "All fields must be entered"});
      fs.readFile(__dirname + '/../Book.json', (err, data) => {
        if(err){
          console.log(err);
          return;
        }
        const database = JSON.parse(data);
        database.push(
          {
           id: uuid.v1(),
            name,
            author,
            ISBN
         }
        );
        const db = JSON.stringify(database);
        fs.writeFile(__dirname + '/../Book.json', db, err => {
          if(err) throw err;
          res.status(200).send({status: 'ok', msg: 'Success', database})
        })
      });    
})

route.post('/delete_book', (req, res) => {
    const {id} = req.body;

    if(!id)
      return res.status(400).send({status: 'error', msg: 'ID field must be entered'});
    let index = -1;
    fs.readFile(__dirname + '/../Book.json', (err, data) => {
      if(err){
        console.log(err);
        return;
      };

      const database = JSON.parse(data);
      console.log(database)
      let found = database.some((book) => {
        index++;
        return book.id === id;
      })
      if(!found)
        return res.status(400).send({status: 'error', msg: 'Book not found'});
      
      database.splice(index, 1);
      const db = JSON.stringify(database);
      
        
      fs.writeFile(__dirname + '/../Book.json', db, err => {
        if(err) throw err;
        res.status(200).send({status: 'ok', msg: 'Success', database})
      });
    });

})



module.exports = route;
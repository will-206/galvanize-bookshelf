'use strict';

const express = require('express');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');

// YOUR CODE HERE
router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }
  
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert(decamelizeKeys(req.body), '*')
    .then((book) => {
      res.send(camelizeKeys(book[0]))
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    // .first()
    .then((book) => {
      if(!book) {
        return next();
      }

      return knex('books')
        .update(decamelizeKeys(req.body), '*')
        .where('id', req.params.id);
    })
    .then((book) => {
      res.send(camelizeKeys(book[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .del('*')
    .then((book) => {
      if(!book[0]) {
        return next();
      }

      delete book[0].id;
      res.send(camelizeKeys(book[0]));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

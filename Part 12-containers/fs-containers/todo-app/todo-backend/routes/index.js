const express = require('express');
const { get } = require('../redis')
const router = express.Router();
const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET statistics. */
router.get('/statistics', async (req, res) => {
  const addedTodos = await get('added_todos')
  res.send({ added_todos: addedTodos ? parseInt(addedTodos) : 0})
})

module.exports = router;

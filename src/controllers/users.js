//import the User constant explicitly
const { User } = require('../database/models')
const trunks = require('trunks-log')
const log = new trunks('USERS')

//show all users
const index = async (req, res) => {
  
  //query the DB of all users
  await User.find().exec()
  .then(users => {
    log.success('Retrieved all {} users', users.length)
    res.json({ users: users})
  })
  .catch(err => {
    log.error(err, 'Could not retrieve users: {}', err.message)
    res.json({ error: err, message: "Could not retrieve users"}).status(500)
  })
}

//Store a new user
const store = async (req, res) => {
  console.log(req.body) 
  let user = new User(req.body)

  //save it in the DB
  await user.save()
    .then(user => {
      log.success('Created User: {}', user.email)
      //send a 201 and the new resource
      res.status(201).json({ data: user })
    })
    .catch(err => {
      log.error(err, 'Error creating user: {}', user.email)
      let errStatus = err.name === 'ValidationError' ? 400 : 500
      res.status(errStatus).json({err: err})
    })
}

//this function is for looking at one user by their mongo id
const show = async (req, res) => {

  //find this sneaky boye
  await User.findById(req.params.id).exec()
  .then(user => {
    log.success('Found user: {}', user.name)
    res.json({ user: user})
  })
  .catch(err => {
    log.error(err, 'Error finding user: {}', req.params.id)
    res.json({ error: err, message: 'Could not retrieve user'}).status(500)
  })
}

//ever wanted to make the users disappear 
const destroy = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id)

    res.status(204).send()
  } catch (error) {
    log.error(err, 'Error finding user: {}', req.params.id)
  }
}

//edit a user based on ID
const update = async (req, res) => {
  await User
  .findByIdAndUpdate(req.params.id, req.body, { new: true })
  .exec()
    .then(user => {
      log.success('Updated user: {}', req.params.id)
      res.status(200).json({user: user})
    })
    .catch(err => {
      log.error(err, "Could not update user: {}", req.params.id)
      res.status(500).json({err: err})
    })
}

export { index, store, show, destroy, update }
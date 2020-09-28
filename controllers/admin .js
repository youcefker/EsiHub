const User = require('../models/Users')
const Project = require('../models/Project')

exports.adminLogIn = (req,res,next) => {
  User.findAll()
  .then(users => {
    return Project.findAll()
    .then(projects => {
      res.render('admin',{
        projects: projects,
        users: users
      })
    })
  }).catch(err => {
    console.log(err)
  })
}
exports.delete = (req,res,next) => {
  const info = req.params.info
  Project.findByPk(info)
  .then(project => {
    if(project){
      return Project.destroy({where: {id: info}}).then(result => {
        res.redirect('/admin')
      })
    }else {
       return User.destroy({where: {id: info}}).then(result => {
        res.redirect('/admin')
      })
    }
  })
  .catch(err => {
    console.log(err)
  })
}

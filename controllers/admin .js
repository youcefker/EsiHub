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
/*exports.deleteProject = (req,res,next) => {
  const projectId = 
}*/

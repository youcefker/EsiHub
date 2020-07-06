const Project = require('../models/Project')

const User = require('../models/Users')

const path = require('path')

const { validationResult } = require('express-validator/check')

exports.getAddProject = (req, res, next) => {
    res.render('project/add-project', {
        pageTitle : 'Add Your New Project!',
        path: '/add-project',
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddProject = (req, res, next) => {
    const title = req.body.title
    const projectType = req.body.projectType
    const description = req.body.description
    const projectImage = req.file

    if (!projectImage) {
        return res.status(422).render('project/add-project', {
          pageTitle: 'Add Your New Project!',
          path: '/add-project',
          project: {
            title: title,
            projectType: projectType,
            description: description,
            likesNumber: 0
          },
          errorMessage: 'Attached file is not an image.',
          validationErrors: []
        });
      }
      
      let errors = []
     errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('project/add-project', {
          pageTitle: 'Add Your New Project!',
          path: '/add-project',
          hasError: true,
          project: {
            title: title,
            projectType: projectType,
            description: description
          },
          errorMessage: 'invalid ' + errors.array()[0].param + ' value',
          validationErrors: errors.array()
        });
      }
    const imagePath = projectImage.path.split("\\")
    imagePath.shift()
    imageUrl = imagePath.join('/')
    console.log(req.session._id)
    User.findByPk(req.session._id)
    .then(user => {
      if (!user) {
        res.redirect('/')
      }
     return user.createProject({
        title: title,
        projectType: projectType,
        description: description,
        imagePath: imageUrl,
        likesNumber:0,
        rating: 0,
        numberOfRaters: 0
    })
    .then(result => {
        console.log('project created successfully')
        res.redirect('/projects')
    })
    })
    .catch(err => {
      console.log(err)
    });
    
     
}

exports.getProjects = (req, res, nexy) => {
      Project.findAll()
      .then(projects => {
        res.render('project/projects-list', {
            projs: projects,
            pageTitle: 'All Projets',
            path: '/projects'
          });
      })
      .catch(err => {
          console.log(err)
      })
      
    }
exports.getProject = (req, res, next) => {
    projectId = req.params.projectId
    Project.findByPk(projectId)
    .then(project => {
        User.findByPk(project.userId).then(user => {
          res.render('project/project-description', {
            pageTitle: project.title,
            path: '/projects',
            project: project,
            user: user
        })
        })
        
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getEditProject = (req, res, next) => {

}

const User = require('../models/Users')

const Project = require('../models/Project')

const Notification = require('../models/Notification')

const { param } = require('jquery')
const { session } = require('passport')
const { getEditProject } = require('./project')

exports.getNotify = (req, res, next) => {
    let userNotifications = []
    const id = req.session._id
    User.findByPk(id)
    .then(user => {
        console.log(user)
        user.getProjects()
        .then(projects => {
            projects.map(project => {
                userNotifications.push(project.getNotifications()
                .then(notifications => {
                    return notifications
                }))
            res.render('project/notification', {
                    pogeTitle: 'Your Notifications',
                    path:'/notification',
                    notifications: userNotifications
            })
            });
            
        })
    })
    .catch(err => {
        console.log(err)
    })
    
}

exports.getAddComment = (req, res, next) => {
    const projectId = req.params.projectId
    Project.findByPk(projectId)
    .then(project => {
        project.getNotifications({where: {type: 'comment'}}).then(notifications => {
            res.render('project/add-comment', {
                project: project,
                path: '/add-comment',
                commentNotifications: notifications.reverse()
            })        
        })
    })
    .catch(err => {
        console.log(err)
    })

}

exports.postAddComment = (req, res, next) => {
    const projectId = req.body.projectId
    Project.findByPk(projectId)
    .then(project => {
        const comment = req.body.comment 
        project.createNotification({
            content: comment,
            type:'comment',
            notifierId: req.session._id,
            date: new Date(),
        }).then(result => {
            console.log('content added successfully')
            res.redirect('/add-comment/' + project.id)
        })
    })
    .catch(err => {
        console.log(err)
    })
   
}
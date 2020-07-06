const User = require('../models/Users')

const Project = require('../models/Project')

const Notification = require('../models/Notification')

const { param } = require('jquery')
const { session } = require('passport')
const { getEditProject } = require('./project')
const { DATE } = require('sequelize/types')

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

exports.addLike = (req, res, next) => {
    const projectId = req.params.projectId 
    console.log(projectId)
    Project.findByPk(projectId)
    .then(project => {
        return  Project.update({likesNumber: project.likesNumber + 1}, { where: {id: projectId}, individualHooks: true})
        .then(result => {
            console.log(result)
            return project.createNotification({
                content: '',
                type: 'like',
                notifierId:req.session._id,
                date: new Date()
            }).then(result => {
                console.log('like added successfully')
                res.status(200).json({message: "project updated successfully!"})
            })
            
        })
    })
    .catch(err => {
        res.status(500).json({message: "something went wrong."})
    })
}

exports.addRating = (req, res, next) => {
    const projectId = req.params.projectId
    const ratingValue = int(req.body.ratingValue)
    console.log(ratingValue)
    Project.findByPk(projectId)
    .then(project => {
        return Project.update({rating: project.rating + ratingValue/(project.numberOfRaters + 1) }, { where: {id: projectId}, individualHooks: true})
        .then(result => {
            return project.createNotification({
                content: ratingValue + 'stars',
                type: 'rating',
                notifierId: req.session._id,
                date: new Date()
            })
            .then(result => {
                res.status(200).json({message: "project updated successfully!"})
            })
        })
    })
    .catch(err => {
        res.status(500).json({message: "something went wrong."})
    })
}
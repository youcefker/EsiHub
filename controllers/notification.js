const User = require('../models/Users')

const Project = require('../models/Project')

const Notification = require('../models/Notification')


exports.getNotify = (req, res, next) => {
    const id = req.session._id
    Notification.findAll({where: {
        projectUser: id
    }})
    .then(notifications => {
        res.render('project/notification', {
            path:'/notifications',
            notifications: notifications
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
        console.log(project)
        project.getNotifications({where: {type: 'comment'}}).then(notifications => {
            res.render('project/add-comment', {
                project: project,
                path: '/add-comment',
                commentNotifications: notifications.reverse(),
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
        const id = req.session._id
        User.findByPk(id)
        .then(user => {
            console.log(user.avatar)
            console.log(project.user_id)
            return project.getUsers()
            .then(projectUsers => {
            return project.createNotification({
                content: comment,
                type:'comment',
                notifierId: id,
                notifierAvatar: user.avatar,
                notifier: user.userName,
                date: new Date(),
                projectUser: projectUsers[0].id,
                projectTitle: project.title
            }).then(result => {
                console.log('content added successfully')
                res.redirect('/add-comment/' + project.id)
            }) 
            })
            .then()
            
        })
        
    })
    .catch(err => {
        console.log(err)
    })
   
}

exports.addLike = (req, res, next) => {
    const projectId = req.params.projectId 
    Project.findByPk(projectId)
    .then(project => {
            return User.findByPk(req.session._id).then(user => {
                return project.getUsers()
            .then(projectUsers => {
                return project.createNotification({
                    content: '',
                    type: 'like',
                    notifierAvatar:user.avatar,
                    notifier: user.userName,
                    notifierId:req.session._id,
                    date: new Date(),
                    projectUser: projectUsers[0].id,
                    projectTitle: project.title
                })
                .then(result => {
                    return  Project.update( {likesNumber: project.likesNumber + 1}, { where: {id: projectId}, individualHooks: true})
                    .then(result => {
                    console.log('like added successfully')
                    res.status(200).json({message: "project updated successfully!"})
                })
            })
            
            
        })
            })
            
    })
    .catch(err => {
        res.status(500).json({message: "something went wrong."})
    })
}

exports.addRating = (req, res, next) => {
    const info = req.params.info
    const arrayInfo = info.split(':')
    const projectId = arrayInfo[0]
    const ratingValue = parseInt(arrayInfo[1])
    console.log(ratingValue)
    User.findByPk(req.session._id)
    .then(user => {
        return Project.findByPk(projectId)
        .then(project => {
            return project.getUsers()
            .then(projectUsers => {
                return Project.update({rating: parseInt(project.rating) + ratingValue }, { where: {id: projectId}, individualHooks: true})
            .then(result => {
                return Project.update({numberOfRaters: parseInt(project.numberOfRaters) + 1 }, { where: {id: projectId}, individualHooks: true})
                .then(update => {
                    return project.createNotification({
                        content: ratingValue,
                        type: 'rating',
                        notifierId: req.session._id,
                        notifierAvatar: user.avatar,
                        notifier: user.userName,
                        date: new Date(),
                        projectUser: projectUsers[0].id,
                        projectTitle: project.title
                    })
                    .then(result => {
                        res.status(200).json({message: "project updated successfully!"})
                    })
                })
                
            })
            })
            
        })
        .catch(err => {
            res.status(500).json({message: "something went wrong."})
        })
    })
    
}
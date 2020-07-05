const Project = require('../models/Project')
const sequelize = require('sequelize')
const Op = sequelize.Op
exports.getSearch = (req, res, next) => {
    res.render('search',{
        pageTitle:'find projects',
        path:'/search'
    })
}
exports.postSearch = (req, res, next) => {
    project = req.body.project
    type = req.body.type
    Project.findAll({where:  {[Op.or]: [{title:'%' + project + '%'},{description:'%' + project + '%'},{projectType:type }]}})
    .then(projects => {
        console.log(projects)
        res.render('project/projects-list', {
            pageTitle:'Projects',
            path:'/search',
            projs: projects
        })
    })
    .catch(err => console.log(err))
}


const User = require("../models/Users");
const Project = require('../models/Project')
const db = require("../config/database");
const path = require('path')

exports.myProfile = async(req, res) => {
    const id = req.session._id
    console.log(id)
    const user = await User.findOne({where : {id : id}})
    user.getProjects()
    .then(projects => {
        res.render('myProfile',{
            profile : {
                name : user.userName,
                avatar : user.avatar,
                facebook : user.fb ,
                linkedin : user.linkedIn,
                github : user.gitHub,
                bio : user.bio
            },
            projects : projects
        })
    })
    .catch(err => {
        console.log(err)
    })
   
}

exports.updateProfile = (req , res)=>{
    console.log('userrrrrrrr')

    const id = req.session._id
    const fb = req.body.facebook
    const linkedIn = req.body.linkedin
    const gitHub = req.body.github
    const bio = req.body.bio
    console.log('userrrrrrrr')

    User.update(
        {
            fb,
            linkedIn,
            gitHub,
            bio
    
        } ,
        {where :{
            id : id
    
    
}} ).then(console.log('userrrrrrrr'))
    res.redirect('/me')
    }
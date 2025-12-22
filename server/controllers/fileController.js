const fileService = require('../services/fileService')
// const User = require('../models/User')
const File = require('../models/File')


class FileController {
    async createDir(req, res) {
        try {
            //получаем данные из запроса
            const {name, type, parent} = req.body
            /*
            * {
            *   name: bmw,
            *   type: dir,
            *   parent: auto,
            *   user: rr12fr
            * }
            * */
            const file = new File({name, type, parent, user: req.user.id})
            //найдем родительский файл
            console.log('createDir', file)
            const parentFile = await File.findOne({_id: parent})
            if(!parentFile) {
                file.path = name //test
                /*
                * {
                *   name: bmw,
                *   type: dir,
                *   parent: auto,
                *   user: rr12fr
                *   path: bmw
                * }
                * */
                await fileService.createDir(file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                /*
                * {
                *   name: bmw,
                *   type: dir,
                *   parent: auto,
                *   user: rr12fr
                *   path: auto\\bmw
                * }
                * */
                await fileService.createDir(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log('53',e)
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res) {
        try {
            const files = await File.find({user: req.user.id, parent: req.query.parent})
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Can not get files"})
        }
    }
}

module.exports = new FileController()
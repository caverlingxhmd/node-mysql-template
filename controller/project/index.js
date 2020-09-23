import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'

class Project extends BaseComponent {
  constructor() {
    super()
    this.list = this.list.bind(this)
    this.add = this.add.bind(this)
    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
  }
  async list(req, res, next) {
    console.log(typeof this.models['project_info_model'].findAll)
    try {
      let list = await this.models['project_info_model'].findAll()
      console.log(list)
      res.send({
        status: this.config.success,
        data: list,
        msg: "请求成功"
      })
    } catch (ex) {

      res.send({
        status: this.config.error,
        msg: ex
      })
    }
  }
  async add(req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async(err, fields, files) => {
      if (!fields.project_name) {
        return res.send({
          status: this.config.error,
          msg: '项目名称不能为空'
        })
      }
      if (!fields.bussiness_type) {
        return res.send({
          status: this.config.error,
          msg: '项目类型不能为空'
        })
      }
      try {
        let list = await this.models['project_info_model'].findOne({
          where: {
            project_name: fields.project_name
          }
        })
        if (list) {
          return res.send({
            status: this.config.error,
            msg: '项目名称已经存在'
          })
        }
        if (files.icon_uri) {
          let icon_uri = await this.uploadImage(files.icon_uri)
          if (!icon_uri.url) {
            return res.send(icon_uri)
          }
          fields.icon_uri = icon_uri.url
        }
        let keyArr = ["icon_uri", "dev_uri", "test_uri", "pre_uri", "prod_uri", "desc", "git_address"]
        keyArr.forEach(key => {
          fields[key] = fields[key] || ""
        })
        await this.models['project_info_model'].create(fields)
        res.send({
          status: this.config.success,
          msg: "创建项目成功"
        })
      } catch (ex) {
        res.send({
          status: this.config.error,
          msg: '服务异常'
        })
      }
    })
  }
  async edit(req, res, next) {
    let { id } = req.params
    if (!id) {
      return res.send({
        status: this.config.error,
        msg: '请选择需要修改的项目'
      })
    }
    const form = new formidable.IncomingForm()
    form.parse(req, async(err, fields, files) => {
      if (!fields.project_name) {
        return res.send({
          status: this.config.error,
          msg: '项目名称不能为空'
        })
      }
      if (!fields.bussiness_type) {
        return res.send({
          status: this.config.error,
          msg: '项目类型不能为空'
        })
      }
      try {
        let list = await this.models['project_info_model'].findOne({
          where: {
            id
          }
        })
        if (!list) {
          return res.send({
            status: this.config.error,
            msg: '该项目不存在'
          })
        }
        if (files.icon_uri) {
          await this.deleteImage(list.icon_uri)
          let icon_uri = await this.uploadImage(files.icon_uri)
          if (!icon_uri.url) {
            return res.send(icon_uri)
          }
          fields.icon_uri = icon_uri.url
        }
        let keyArr = ["icon_uri", "dev_uri", "test_uri", "pre_uri", "prod_uri", "desc", "git_address"]
        keyArr.forEach(key => {
          fields[key] = fields[key] || ""
        })
        await this.models['project_info_model'].update(fields, {
          where: {
            id
          }
        })
        res.send({
          status: this.config.success,
          msg: "修改项目成功"
        })
      } catch (ex) {
        res.send({
          status: this.config.error,
          msg: '服务异常'
        })
      }
    })
  }
  async delete(req, res, next) {
    let { id } = req.params
    if (!id) {
      return res.send({
        status: this.config.error,
        msg: '请选择需要修改的项目'
      })
    }
    try {
      let list = await this.models['project_info_model'].findOne({
        where: {
          id
        }
      })
      if (!list) {
        return res.send({
          status: this.config.error,
          msg: '该项目不存在'
        })
      }
      await this.models['project_info_model'].destroy({
        where: {
          id
        }
      })
      res.send({
        status: this.config.success,
        msg: "删除项目成功"
      })
    } catch (ex) {
      res.send({
        status: this.config.error,
        msg: '服务异常'
      })
    }
  }
}

export default new Project()
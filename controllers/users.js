import users from '../models/users.js'
import vacations from '../models/userPunchrecords.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      name: req.body.name,
      number: req.body.number,
      password: req.body.password,
      image: req.body?.image || '',
      team: req.body.team,
      role: req.body?.role || 0,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day,
      timerecord: []
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        token,
        name: req.user.name,
        number: req.user.number,
        role: req.user.role,
        team: req.user.team,
        year: req.user.year,
        month: req.user.month,
        day: req.user.day,
        image: req.user.image
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        name: req.user.name,
        number: req.user.number,
        role: req.user.role,
        team: req.user.team
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const getUserAdmin = async (req, res) => {
  try {
    const result = await users.findOne({ number: req.params.number })
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const getTeam = async (req, res) => {
  const teamEnumValues = users.schema.path('team').enumValues
  res.json(teamEnumValues)
}

export const editUser = async (req, res) => {
  try {
    const data = {
      number: req.body.number,
      name: req.body.name,
      team: req.body.team
    }
    if (req.body.password) {
      data.password = req.body.password
    }
    const id = req.user._id
    const result = await users.findByIdAndUpdate(id, data, { new: true })
    res.status(200).send({ success: true, message: result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: error.message })
    }
  }
}
export const editUserAdmin = async (req, res) => {
  try {
    const data = {
      number: req.body.number,
      name: req.body.name,
      role: req.body.role,
      team: req.body.team,
      depart: req.body.depart
    }
    // 如果 req.body.password 不為空，则添加到 data
    if (req.body.password) {
      data.password = req.body.password
    }
    const result = await users.findByIdAndUpdate({ _id: req.body._id }, data, { new: true })
    res.status(200).send({ success: true, message: result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: error.message })
    }
  }
}
// ------------------
// export const editUser = async (req, res) => {
//   try {
//     const result = await users.findById(req.body._id)
//     result.email = req.body.email || result.email
//     result.phone = req.body.phone || result.phone
//     result.name = req.body.name || result.name
//     result.password = req.body.password || result.password
//     result.account = req.body.account || result.account
//     await result.save()
//     res.status(200).json({
//       success: true,
//       result: {
//         email: result.email,
//         phone: result.phone,
//         name: result.name,
//         account: result.account
//       }
//     })
//   } catch (error) {
//     res.status(500).json({ success: false, message: '未知錯誤' })
//   }
// }
// ----------------------

export const findAllUserVacation = async (req, res) => {
  try {
    const result = await vacations.find()
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// export const findVacationsByDate = async (req, res) => {
//   try {
//     const date = req.body.date

//     const userwithVacation = await users.find().populate('vacation')
//     const vacations = userwithVacation.flatMap(users => users.vacation)
//     const vacationss = await vacations.find({ startDate: { $lte: date }, endDate: { $gte: date } })
//     res.status(200).json({ success: true, message: vacationss })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// export const findVacationsByDate = async (req, res) => {
//   try {
//     const date = req.body.date
//     const vacationss = await vacations.find({ date: { $lte: date }, endDate: { $gte: date } })
//     res.status(200).json({ success: true, message: vacationss })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

export const getAllUser = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const result = await users.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const findUserVacation = async (req, res) => {
  try {
    const result = await vacations.find({ number: req.params.number })
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import workRoute from './routes/work.js'
import workScheduleRoute from './routes/workSchudule.js'
import './passport/passport.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true)

const app = express()
// 跨域請求設定
app.use(
  cors({
    origin: '*'
  })
)

app.get('/', (req, res) => {
  res.status(200).send('OK')
})
// 處理跨域錯誤
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
app.use('/work', workRoute)
app.use('/workschedule', workScheduleRoute)
app.get('/download/workschedule', (req, res) => {
  const file = join(__dirname, './workschedule.csv') // 使用path.join來建立路徑
  res.download(file) // 讓用戶端下載這個檔案
})
app.get('/download/work', (req, res) => {
  const file = join(__dirname, './workinput.csv') // 使用path.join來建立路徑
  res.download(file) // 讓用戶端下載這個檔案
})
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`)
})

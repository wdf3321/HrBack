import dotenv from 'dotenv'
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import workRoute from './routes/work.js'
import workScheduleRoute from './routes/workSchudule.js'
// import pakkaRoute from './routes/pakka.js'
import overhourRoute from './routes/overhour.js'
import leaveRoute from './routes/leave.js'
import dutyDaysRoute from './routes/dutyDays.js'
import IndeedRoute from './routes/workerIndeed.js'
import swaggerUi from 'swagger-ui-express'
import rateLimit from 'express-rate-limit'
import './passport/passport.js'
import swaggerDocument from './swagger.json' assert { type: 'json' };
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'


// ---------------------------------------------
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mongoose.connect(process.env.DB_URL, {
  keepAlive: true, // 設置 keepAlive 為 true
  keepAliveInitialDelay: 30000
})// 可選：指定 keep-alive 延遲（毫秒）)
mongoose.set('sanitizeFilter', true)

const app = express()
// const limiter = rateLimit({
//   windowMs:  60 * 1000, // 限制時間
//   max: 100 // 限制請求數量
// })
// app.use(limiter)
// 跨域請求設定
app.use(
  cors({
    origin: '*'
  })
)

app.get('/', (req, res) => {
  res.status(200).send('OK')
})

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
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
// app.use('/pakka', pakkaRoute)
app.use('/overhour', overhourRoute)
app.use('/leave', leaveRoute)
app.use('/dutydays', dutyDaysRoute)
app.use('/indeed', IndeedRoute)

app.get('/download/workschedule', (req, res) => {
  const file = join(__dirname, './workschedule.csv') // 使用path.join來建立路徑
  res.download(file) // 讓用戶端下載這個檔案
})
app.get('/download/work', (req, res) => {
  const file = join(__dirname, './workinput.csv') // 使用path.join來建立路徑
  res.download(file) // 讓用戶端下載這個檔案
})
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}${process.env.team_name}${process.env.NODE_ENV}`)
})

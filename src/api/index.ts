// import app from 'server'

import app from './server'
import { PORT } from './config'

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

export default app

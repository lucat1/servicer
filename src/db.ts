import { writeFileSync, readFileSync } from 'fs'

export const DB   = <Object>JSON.parse(readFileSync('./data.json').toString())
export const save = () => writeFileSync('./data.json', JSON.stringify(DB))

export default DB
#!/usr/bin/env node

import { compileVersion7 } from './compileVersion7'

const fileName = process.argv[2]
const typeName = process.argv[3]

const schema = compileVersion7(fileName, typeName)
console.log(JSON.stringify(schema, null, 2))

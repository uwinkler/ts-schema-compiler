import { resolve } from 'path'
import * as TJS from 'typescript-json-schema'

const settingsV7: TJS.PartialArgs = {
  required: true,
  noExtraProps: true, // There is a bug in the ajv compiler
  ref: true
}

const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
  baseUrl: './src',
  skipLibCheck: true
}

export function compileVersion7(fileName: string, typeName: string): any {
  const program = TJS.getProgramFromFiles(
    [resolve(fileName)],
    compilerOptions,
    './'
  )

  const schema = TJS.generateSchema(program, typeName, settingsV7)
  return schema
}

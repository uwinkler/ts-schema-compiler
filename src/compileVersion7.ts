import { resolve } from 'path'
import * as TJS from 'typescript-json-schema'

const settingsV7: TJS.PartialArgs = {
  required: true,
  noExtraProps: true, // There is a bug in the ajv compiler
  ref: true,
  ignoreErrors: true
}

const defaultCompilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
  skipLibCheck: true,
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  resolveJsonModule: true
}

export function compileVersion7(fileName: string, typeName: string): any {
  const program = TJS.getProgramFromFiles(
    [resolve(fileName)],
    { ...defaultCompilerOptions },
    './'
  )

  const schema = TJS.generateSchema(program, typeName, settingsV7)
  return schema
}

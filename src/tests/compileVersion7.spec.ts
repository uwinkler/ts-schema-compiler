import { compileVersion7 } from '../compileVersion7'
import Ajv from 'ajv'
import { Test } from './Types'

let schema = {}

beforeAll(() => {
  schema = compileVersion7(__dirname + '/' + 'Types.ts', 'Test')
})

it('should compile stuff', () => {
  expect(schema).toMatchInlineSnapshot(`
Object {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "additionalProperties": false,
  "definitions": Object {
    "OtherInterface": Object {
      "additionalProperties": false,
      "properties": Object {
        "stringArray": Object {
          "items": Object {
            "type": "string",
          },
          "type": "array",
        },
      },
      "required": Array [
        "stringArray",
      ],
      "type": "object",
    },
    "YetAnotherInterface": Object {
      "additionalProperties": false,
      "properties": Object {
        "numberArray": Object {
          "items": Object {
            "type": "number",
          },
          "type": "array",
        },
      },
      "required": Array [
        "numberArray",
      ],
      "type": "object",
    },
  },
  "properties": Object {
    "optional": Object {
      "additionalProperties": false,
      "properties": Object {
        "a": Object {
          "type": "string",
        },
      },
      "required": Array [
        "a",
      ],
      "type": "object",
    },
    "otherInterface": Object {
      "anyOf": Array [
        Object {
          "$ref": "#/definitions/OtherInterface",
        },
        Object {
          "$ref": "#/definitions/YetAnotherInterface",
        },
        Object {
          "type": "null",
        },
      ],
    },
    "value": Object {
      "type": "number",
    },
  },
  "required": Array [
    "otherInterface",
    "value",
  ],
  "type": "object",
}
`)
})

it('should validate', () => {
  const ajv = new Ajv({ allErrors: true, removeAdditional: true })
  const validate = ajv.compile(schema)

  {
    const shouldPass: Test = {
      value: 1,
      otherInterface: {
        stringArray: ['1', '2']
      },
      optional: {
        a: 'hi'
      }
    }
    validate(shouldPass)
    expect(validate.errors?.length === 0)
  }

  {
    const shouldPassWithoutOptional: Test = {
      value: 1,
      otherInterface: {
        stringArray: ['1', '2']
      }
    }
    validate(shouldPassWithoutOptional)
    expect(validate.errors?.length === 0)
  }

  {
    const shouldPassWithEmptyArray: Test = {
      value: 1,
      otherInterface: {
        stringArray: ['1', '2']
      }
    }
    validate(shouldPassWithEmptyArray)
    expect(validate.errors?.length === 0)
  }

  {
    const shouldPassWithNull: Test = {
      value: 1,
      otherInterface: null
    }
    validate(shouldPassWithNull)
    expect(validate.errors?.length === 0)
  }

  {
    const shouldNotPass = {
      bla: 'tre',
      value: 'this-should-be-a-number',
      otherInterface: null
    }
    const valid = validate(shouldNotPass)
    expect(valid).toBe(false)
    expect(validate.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "instancePath": "/value",
    "keyword": "type",
    "message": "must be number",
    "params": Object {
      "type": "number",
    },
    "schemaPath": "#/properties/value/type",
  },
]
`)
  }
})

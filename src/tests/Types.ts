interface OtherInterface {
  stringArray: string[]
}

interface YetAnotherInterface {
  numberArray: number[]
}

type UnionType = OtherInterface | YetAnotherInterface

export interface Test {
  value: number
  optional?: {
    a: string
  }
  otherInterface: UnionType | null
}

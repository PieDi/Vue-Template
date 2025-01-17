// 根据唯一 大驼峰的 name，转路径
export const nameToLowPath = (name: string) =>
  name
    ?.split(/(?=[A-Z])/)
    .map(str => str.toLocaleLowerCase())
    .join('-')

export const removeKeys = (base, ...ids: string[]) => 
  (result, key: string) => {
    if (ids.indexOf(key) == -1) {
      result[key] = base[key]
    }

    return result
  }
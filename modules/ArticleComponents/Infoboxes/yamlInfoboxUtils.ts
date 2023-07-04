export function warnIfExtraKeys(
  data: Object,
  allowedKeys: string[],
  fileName: string,
) {
  const extraKeys = Object.keys(data).filter(
    (key) => !allowedKeys.includes(key),
  )
  if (extraKeys.length > 0) {
    console.warn(
      `Extra keys in ${fileName}: ${extraKeys.join(
        ", ",
      )}. Allowed keys: ${allowedKeys.join(", ")}`,
    )
  }
}

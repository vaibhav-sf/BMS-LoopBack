export function logMethod() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      console.log(`[decorator] calling ${propertyKey} with`, args);
      return original.apply(this, args);
    };
    return descriptor;
  };
}

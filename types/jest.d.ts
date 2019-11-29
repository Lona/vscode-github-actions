declare namespace jest {
  interface Matchers<R, T> {
    toBeValidSchema(): R;
    toMatchSchema(schema: any): R;
  }
}

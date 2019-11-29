import * as fs from "fs";
import { matchers } from "jest-json-schema";
import * as yaml from "js-yaml";
import * as path from "path";

expect.extend(matchers);

const schema = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "../workflow.schema.json"), "utf8")
);

test("workflow schema is valid", () => {
  expect(schema).toBeValidSchema();
});

fs.readdirSync(path.join(__dirname, "./cases")).forEach(file => {
  const testCase = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, "./cases", file), "utf8")
  );

  test(file + " should be a valid workflow", () => {
    expect(testCase).toMatchSchema(schema);
  });
});

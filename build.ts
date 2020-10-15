import showdown from "https://jspm.dev/showdown";
const { Converter } = showdown as any;

const sourceDirs = ["./a", "./s"];
const sourceFileFilter = /(.+)\.md$/;
const destDir = "../sholvoir.github.io/";

const header = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
</head>
<body>
`;
const footer = `
</body>
</html>`;

const converter = new Converter();

for (const sourceDir of sourceDirs) {
  for await (const file of Deno.readDir(sourceDir)) {
    if (file.isFile || file.isSymlink) {
      const matchResult = sourceFileFilter.exec(file.name);
      if (matchResult) {
        const fileName = matchResult[1];
        let filePath = `${sourceDir}/${file.name}`;
        if (file.isSymlink) filePath = await Deno.readLink(filePath);
        await Deno.writeTextFile(
          `${destDir}${sourceDir}/${fileName}.html`,
          `${header}${
            converter.makeHtml(await Deno.readTextFile(filePath))
          }${footer}`,
        );
      }
    }
  }
}

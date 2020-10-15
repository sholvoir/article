import showdown from 'https://jspm.dev/showdown';
const { Converter } = showdown as any;

const sourceDirs = ['./a', './s'];
const sourceFileFilter = /(.+)\.md$/;
const destDir = '../sholvoir.github.io/';

const converter = new Converter();

for (const sourceDir of sourceDirs) {
    for await (const file of Deno.readDir(sourceDir)) {
        if (file.isFile || file.isSymlink) {
            const matchResult = sourceFileFilter.exec(file.name);
            if (matchResult) {
                const fileName = matchResult[1];
                let filePath = `${sourceDir}/${file.name}`;
                if (file.isSymlink) filePath = await Deno.readLink(filePath);
                await Deno.writeTextFile(`${destDir}${sourceDir}/${fileName}.html`, converter.makeHtml(await Deno.readTextFile(filePath)));
            }
        }
    }
};

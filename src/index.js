import * as investments from './parser/investments'

export const getParserForInvestments = (filename) => {
    const availableParsers = Object.values(investments).filter(parser => {
        return parser.canParseFile(filename)
    });

    if (availableParsers.length == 0) {
        throw 'No parser can parse the file: ' + filename;
    }

    if (availableParsers.length > 1) {
        throw 'More than one parser can parse the file: ' + filename;
    }

    return availableParsers[0];
}
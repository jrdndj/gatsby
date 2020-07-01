const { parseImportBindings } = require(`../import-parser`)

function getBruteForceCases() {
  // These cases will be individually tested in four different ways;
  // - as is
  // - replace all spaces by newlines
  // - minified (drop all spaces that are not mandatory)
  // - replace all spaces by three spaces

  const bruteForceCases = `
    import foo from 'bar'
    import foo as bar from 'bar'
    import * as foo from 'bar'
    import {foo} from 'bar'
    import {foo as bar} from 'bar'
    import {foo, bar} from 'bar'
    import {foo, bar as boo} from 'bar'
    import {foo as bar} from 'bar'
    import {foo as bar, baz} from 'bar'
    import {foo as bar, baz as boo} from 'bar'
    import ding, {foo} from 'bar'
    import ding, {foo as bar} from 'bar'
    import ding, {foo, bar} from 'bar'
    import ding, {foo, bar as boo} from 'bar'
    import ding, {foo as bar} from 'bar'
    import ding, {foo as bar, baz} from 'bar'
    import ding, {foo as bar, baz as boo} from 'bar'
    import ding as dong, {foo} from 'bar'
    import ding as dong, {foo as bar} from 'bar'
    import ding as dong, {foo, bar} from 'bar'
    import ding as dong, {foo, bar as boo} from 'bar'
    import ding as dong, {foo as bar} from 'bar'
    import ding as dong, {foo as bar, baz} from 'bar'
    import ding as dong, {foo as bar, baz as boo} from 'bar'
    import * as dong, {foo} from 'bar'
    import * as dong, {foo as bar} from 'bar'
    import * as dong, {foo, bar} from 'bar'
    import * as dong, {foo, bar as boo} from 'bar'
    import * as dong, {foo as bar} from 'bar'
    import * as dong, {foo as bar, baz} from 'bar'
    import * as dong, {foo as bar, baz as boo} from 'bar'
    import * as $, {_ as bar, baz as boo} from 'bar'
    import _, {foo as $} from 'bar'
    import _ as $ from 'bar'
    import {_, $ as boo} from 'bar'
    import {_ as $, baz as boo} from 'bar'
    import {_, $} from 'bar'
    import as from 'bar'
    import * as as from 'bar'
    import from from 'bar'
    import * as from from 'bar'
    import as, {from} from 'bar'
    import as as x, {from as y} from 'bar'
    import x as as, {x as from} from 'bar'
    import from, {as} from 'bar'
    import from as x, {as as y} from 'bar'
    import x as from, {x as as} from 'bar'
    import {as, from} from 'bar'
    import {from, as} from 'bar'
    import {as as x, from as y} from 'bar'
    import {from as x, as as y} from 'bar'
    import {x as as, y as from} from 'bar'
    import {x as from, y as as} from 'bar'
    import {import as x} from 'bar'
    import {import as x, y} from 'bar'
    import {x, import as y} from 'bar'
  `
    .trim()
    .split(/\n/g)
    .map(s => s.trim())

  return bruteForceCases
}

describe(`regex import scanner`, () => {
  describe(`syntactic coverage`, () => {
    const cases = getBruteForceCases()

    cases.forEach((input, i) => {
      it(`should parse brute force regular case ${i}`, () => {
        const output = parseImportBindings(input, true)
        const bindings = output.bindings

        expect(output.bindings.length).not.toBe(0)
        // Note: putting everything in the snapshot makes reviews easier
        expect({ input, result: output }).toMatchSnapshot()
        expect(
          // All bindings should be non-empty and trimmed
          output.bindings.every(
            binding => binding !== `` && binding === binding.trim()
          )
        ).toBe(true)

        // Confirm that the parser works when all spaces become newlines
        const newlined = input.replace(/ /g, `\n`)
        expect(parseImportBindings(newlined)).toEqual(bindings)

        // Confirm that the parser works with a minimal amount of spacing
        const minified = input.replace(
          /(?<=[_\w$]) (?![_\w$])|(?<![_\w$]) (?=[_\w$])|(?<![_\w$]) (?![_\w$])/g,
          ``
        )
        expect(parseImportBindings(minified)).toEqual(bindings)

        // Confirm that the parser works with an excessive amount of spacing
        const blown = input.replace(/ /g, `   `)
        expect(parseImportBindings(blown)).toEqual(bindings)
      })
    })
  })
})

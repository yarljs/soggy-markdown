var Remarkable = require('remarkable');
var md = new Remarkable();
var dPI = require('dot-prop-immutable');

function stringify(key, s) {
  if (s === undefined) {
    return "{key: undefined}"
  }
  if (s === null) {
    return "null"
  }
  return s;
}

function parse(markdown, data) {
  let stack = [];
  let parse = [];

  let inTemplate = false;
  let line = 0;
  let column = 0;
  for(let i = 0; i < markdown.length; i++)
  {
    if(markdown[i] === '\n')
    {
      column = 0;
      line += 1;
    }
    else
    {
      column += 1;
    }
    if(markdown[i] === '{' && markdown[i + 1] === '{')
    {
      stack.push({token: markdown[i], index: i});
      inTemplate = true;
    }
    else if(markdown[i] === '}' && markdown[i + 1] === '}')
    {
      if (inTemplate) {
        const start = stack.pop();
        parse.push({
          start: start.index,
          end: i + 1
        })
        inTemplate = false;
      }
      else
      {
        throw `Unbalanced closing template at position:(${line}${column})`
      }
    }
  }
  if(stack.length)
  {
    throw `Unbalanced opening template at character position:(${stack[0].index})`
  }
  let res = "";
  let index = 0;
  for(let i = 0; i < parse.length; i++)
  {
    let key = markdown.slice(parse[i].start + 2, parse[i].end - 1);
    let item = dPI.get(data, key);

    res += markdown.slice(index, parse[i].start) + stringify(key, item);
    index = parse[i].end + 2;
  }
  return md.render(res);
}
module.exports = {
  parse: parse
}

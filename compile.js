const fs = require('fs');
const handlebars = require('handlebars');

// Constants
const TEMP_PATH = "./temp"
const DATA_PATH = "./data"
const GEN_PATH = "./gen"
const CSS_PATH = `${TEMP_PATH}/css`;
const JS_PATH = `${TEMP_PATH}/js`;
const IMAGE_PATH = `${TEMP_PATH}/images`;
const PARTIALS_PATH = `${TEMP_PATH}/partials`;

// Helper Functions
const getName = file => file.split('.')[0];

const registerPartial = file => {
  handlebars.registerPartial(getName(file), fs.readFileSync(`${PARTIALS_PATH}/${file}`, 'utf8'))
}

const copys = (file, PATH) => {
  const base = PATH.split('/')[2];
  const path = `${GEN_PATH}/${base}`;
  
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true});
  }
  
  const readFile = fs.readFileSync(`${PATH}/${file}`, 'utf8');
  fs.writeFileSync(`${path}/${file}`, readFile, 'utf8');
}

const generatePage = (file, data) => {
  if (file.includes('.html')) {
    const template = handlebars.compile( fs.readFileSync(`${TEMP_PATH}/${file}`, 'utf8') );
    
    for (let lang in data) {
      const path = `${GEN_PATH}/${lang}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      const generated = data[lang][getName(file)] ? template(data[lang][getName(file)]) : template({});
      fs.writeFileSync(`${path}/${file}`, generated, 'utf-8');
    }
  }
}

const mapDataWithPath = (path) => {
  return (acc, file) => {
    if (file.endsWith(".json")) {
      const data = fs.readFileSync(`${path}/${file}`, 'utf8');
      acc[getName(file)] = JSON.parse(data);
    }
    return acc;
  }
}

const mapLang = (acc, path) => {
  acc[path] = fs.readdirSync(`${DATA_PATH}/${path}`).reduce(mapDataWithPath(`${DATA_PATH}/${path}`), {})
  return acc;
}

// Main Program
const data = fs.readdirSync(DATA_PATH).reduce(mapLang, {})
fs.readdirSync(PARTIALS_PATH).forEach(file => registerPartial(file))
fs.readdirSync(CSS_PATH).forEach(file => copys(file, CSS_PATH))
fs.readdirSync(JS_PATH).forEach(file => copys(file, JS_PATH))
fs.readdirSync(IMAGE_PATH).forEach(file => copys(file, IMAGE_PATH))
fs.readdirSync(TEMP_PATH).forEach(file => generatePage(file, data))


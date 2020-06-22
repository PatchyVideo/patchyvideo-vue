// 18种语言及其对应的简写
const languagesList = [
  { value: "CHS", label: "简体中文" },
  { value: "CHT", label: "繁體中文" },
  { value: "JPN", label: "日本語" },
  { value: "ENG", label: "English" },
  { value: "KOR", label: "한국어" },
  { value: "CSY", label: "čeština" },
  { value: "NLD", label: "Nederlands" },
  { value: "FRA", label: "français" },
  { value: "DEU", label: "Deutsch" },
  { value: "HUN", label: "magyar nyelv" },
  { value: "ITA", label: "italiano" },
  { value: "PLK", label: "polski" },
  { value: "PTB", label: "português" },
  { value: "ROM", label: "limba română" },
  { value: "RUS", label: "русский язык" },
  { value: "ESP", label: "español" },
  { value: "TRK", label: "Türk dili" },
  { value: "VIN", label: "Tiếng Việt" },
];

// 获取语言列表
function getlanguagesList() {
  return languagesList;
}

// 根据语言列表的label获取value
function getlanguagesListValue(label) {
  return languagesList.find((item) => item.label == label).value;
}

// 根据语言列表的value获取label
function getlanguagesListLabel(value) {
  return languagesList.find((item) => item.value == value).label;
}

export { getlanguagesList, getlanguagesListValue, getlanguagesListLabel };

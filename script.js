//формирование запроса
async function getData (url, query, search) {
  const response = await fetch(`${url}${query}${search}`)
  return await response.json()
}

// вынести
const debounce = (appendData, debounceTime = 500) => {
  let timeOut
  return function () {
    const func = () => { appendData.apply(this, arguments) }
    clearTimeout(timeOut)
    timeOut = setTimeout(func, debounceTime)
  }
}

// фабрика по производству объекта репозитория
class Repository {
  constructor (item) {
    this.id = item.id
    this.name = item.name
    this.owner = item.owner.login
    this.stars = item.stargazers_count
  }
}

const entryField = document.querySelector('input')
entryField.addEventListener('input', debounce(appendData))

//отправляем запрос
async function appendData (event) {
  let repositories = await getData(`https://api.github.com/search/repositories`, '?q=topic:', event.target.value)
    .then((data) => {
      console.log(data)
      return data.items.slice(0, 5)
    })
  generateVariations(repositories)
}

// список из поборки репо
function generateVariations (repositories) {

  const variationsParent = document.querySelector('.variations')
  variationsParent.innerHTML = ''

  for (const repo of repositories) {
    variationsParent.innerHTML += `<div id = "${repo.id}" class="variation">${repo.name}</div>`
  }

  if (!entryField.value) {
    variationsParent.innerHTML = ''
  }

  let variations = document.querySelectorAll('.variation')
  for (const variation of variations) {
    variation.addEventListener('click', addRepo.bind(variation, repositories))
  }
}

// формируем репо для списка
function getRepoById (id, repositories) {
  const foundedRepo = repositories.find(repo => repo.id === Number(id))
  return new Repository(foundedRepo)
}

//отриосвываем элемент в список репо
let reposIds = []
function addRepo (repositories) {
  const blockRepo = document.querySelector('.block-repo')
  const constructedRepo = getRepoById(this.id, repositories)

  blockRepo.childNodes.forEach((node) => {
    const nodeId = Number(node.getAttribute('data-id'))
    reposIds.push(nodeId)
  })

  let elem = `<div class="repo" data-id="${constructedRepo.id}">
      <div>
      Name:${constructedRepo.name}</br>
      Owner:${constructedRepo.owner}</br>
      Stars:${constructedRepo.stars}
      </div>
      <div class="close-btn"></div>
      </div>`

  if (!reposIds.includes(Number(constructedRepo.id))) {
    blockRepo.innerHTML += elem
  }
  addDeleteEventOnCloseButton()
}

//навешивание событий на кнопку удалить
const addDeleteEventOnCloseButton = () => {
  let closeBtns = document.querySelectorAll('.close-btn')

  for (const item of closeBtns) {
    item.addEventListener('click', function () {
      const dataId = item.parentNode.getAttribute('data-id')
      item.parentNode.remove()
      const index = reposIds.indexOf(dataId)
      reposIds.splice(index, 1)
    })
  }
}






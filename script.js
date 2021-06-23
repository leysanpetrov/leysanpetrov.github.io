import { debounce } from './utils/debounce.js'
import { getData } from './API/api.js'
import { Repository } from './domain/Repository.js'

const entryField = document.querySelector('input')
entryField.addEventListener('input', debounce(appendData))

async function appendData (event) {
  let repositories = await getData(`https://api.github.com/search/repositories`, '?q=topic:', event.target.value)
    .then((data) => {
      console.log(data)
      return data.items.slice(0, 5)
    })
  generateVariations(repositories)
}

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

let reposIds = []

function addRepo (repositories) {
  const blockRepo = document.querySelector('.block-repo')
  const constructedRepo = Repository.getRepoById(this.id, repositories)

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
